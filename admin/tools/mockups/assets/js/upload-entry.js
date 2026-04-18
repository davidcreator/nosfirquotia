(() => {
    const MIN_WIDTH = 5000;
    const MIN_HEIGHT = 5000;
    const MAX_FILE_SIZE = 40 * 1024 * 1024;
    const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg']);
    const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg']);
    const VALIDATION_STORAGE_KEY = 'mockuphub_upload_validation_v1';
    const UPLOAD_BRIDGE_DB_NAME = 'mockuphub_upload_bridge_db';
    const UPLOAD_BRIDGE_STORE_NAME = 'artwork';
    const UPLOAD_BRIDGE_KEY = 'latest_artwork';
    const UPLOAD_BRIDGE_SESSION_KEY = 'mockuphub_upload_bridge_dataurl_v1';
    const UPLOAD_BRIDGE_ENDPOINT = './upload-bridge.php';

    const input = document.getElementById('workFileInput');
    const uploadCard = document.getElementById('uploadCard');
    const status = document.getElementById('validationStatus');
    const clearBtn = document.getElementById('clearUploadBtn');
    const continueBtn = document.getElementById('continueBtn');
    const previewWrap = document.getElementById('previewWrap');
    const previewImage = document.getElementById('previewImage');
    const metaWrap = document.getElementById('validationMeta');
    const metaName = document.getElementById('metaName');
    const metaSize = document.getElementById('metaSize');
    const metaResolution = document.getElementById('metaResolution');

    const checks = {
        format: document.querySelector('[data-check="format"]'),
        size: document.querySelector('[data-check="size"]'),
        resolution: document.querySelector('[data-check="resolution"]')
    };

    if (!input || !status || !continueBtn) {
        return;
    }

    input.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        await validateFile(file);
    });

    clearBtn?.addEventListener('click', () => resetForm({ clearBridge: true }));

    continueBtn.addEventListener('click', (event) => {
        if (continueBtn.getAttribute('aria-disabled') === 'true') {
            event.preventDefault();
        }
    });

    if (uploadCard) {
        uploadCard.addEventListener('dragenter', (event) => {
            event.preventDefault();
            uploadCard.classList.add('dragging');
        });

        uploadCard.addEventListener('dragover', (event) => {
            event.preventDefault();
            uploadCard.classList.add('dragging');
        });

        uploadCard.addEventListener('dragleave', () => {
            uploadCard.classList.remove('dragging');
        });

        uploadCard.addEventListener('drop', async (event) => {
            event.preventDefault();
            uploadCard.classList.remove('dragging');
            const file = event.dataTransfer?.files?.[0] || null;
            await validateFile(file);
        });
    }

    resetForm({ clearBridge: false });

    async function validateFile(file) {
        resetValidationVisualState();

        if (!file) {
            setStatus('Selecione um arquivo para iniciar a verificacao.', 'pending');
            setContinue(false);
            clearBtn?.setAttribute('disabled', 'disabled');
            await clearUploadBridge();
            return;
        }

        clearBtn?.removeAttribute('disabled');

        const formatOk = isAllowedFile(file);
        setCheckState('format', formatOk);

        if (!formatOk) {
            setStatus('Formato invalido. Envie PNG, JPG ou JPEG.', 'fail');
            hidePreview();
            hideMeta();
            setContinue(false);
            clearValidationStorage();
            await clearUploadBridge();
            return;
        }

        const sizeOk = file.size <= MAX_FILE_SIZE;
        setCheckState('size', sizeOk);

        let dimensions;
        try {
            dimensions = await readImageDimensions(file);
        } catch (error) {
            setStatus('Nao foi possivel ler o arquivo. Tente outro arquivo de imagem.', 'fail');
            setCheckState('resolution', false);
            hidePreview();
            hideMeta();
            setContinue(false);
            clearValidationStorage();
            await clearUploadBridge();
            return;
        }

        const resolutionOk = dimensions.width >= MIN_WIDTH && dimensions.height >= MIN_HEIGHT;
        setCheckState('resolution', resolutionOk);

        showMeta({
            name: file.name,
            size: formatBytes(file.size),
            width: dimensions.width,
            height: dimensions.height
        });

        await showPreview(file);

        if (!sizeOk) {
            setStatus('Arquivo acima do limite de 40 MB.', 'fail');
            setContinue(false);
            clearValidationStorage();
            await clearUploadBridge();
            return;
        }

        if (!resolutionOk) {
            setStatus(`Resolucao insuficiente. Minimo exigido: ${MIN_WIDTH} x ${MIN_HEIGHT} px.`, 'fail');
            setContinue(false);
            clearValidationStorage();
            await clearUploadBridge();
            return;
        }

        const persisted = await persistUploadToBridge(file);
        if (!persisted) {
            setStatus('Nao foi possivel preparar a imagem para o editor. Tente novamente.', 'fail');
            setContinue(false);
            clearValidationStorage();
            await clearUploadBridge();
            return;
        }

        setStatus('Arquivo validado com sucesso. Voce pode seguir para o editor.', 'pass');
        setContinue(true);
        persistValidationData({
            name: file.name,
            type: file.type || '',
            size: file.size,
            width: dimensions.width,
            height: dimensions.height,
            validatedAt: new Date().toISOString()
        });
    }

    function setCheckState(check, passed) {
        const item = checks[check];
        if (!item) {
            return;
        }

        item.classList.remove('is-pass', 'is-fail', 'is-pending');
        item.classList.add(passed ? 'is-pass' : 'is-fail');

        const dot = item.querySelector('.state-dot');
        if (dot) {
            dot.textContent = passed ? 'OK' : 'X';
        }
    }

    function setStatus(message, tone) {
        status.textContent = message;
        status.classList.remove('status-pass', 'status-fail');
        if (tone === 'pass') {
            status.classList.add('status-pass');
            return;
        }
        if (tone === 'fail') {
            status.classList.add('status-fail');
        }
    }

    function setContinue(enabled) {
        continueBtn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        continueBtn.classList.toggle('disabled', !enabled);
    }

    function isAllowedFile(file) {
        const extension = String(file.name || '').toLowerCase().split('.').pop() || '';
        const type = String(file.type || '').toLowerCase();

        return ALLOWED_EXTENSIONS.has(extension) && (!type || ALLOWED_MIME_TYPES.has(type));
    }

    async function readImageDimensions(file) {
        return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(file);
            const image = new Image();

            image.onload = () => {
                resolve({ width: image.naturalWidth, height: image.naturalHeight });
                URL.revokeObjectURL(objectUrl);
            };

            image.onerror = () => {
                reject(new Error('invalid_image'));
                URL.revokeObjectURL(objectUrl);
            };

            image.src = objectUrl;
        });
    }

    async function showPreview(file) {
        if (!previewImage || !previewWrap) {
            return;
        }

        const dataUrl = await readFileAsDataUrl(file);
        previewImage.src = dataUrl;
        previewWrap.hidden = false;
    }

    function hidePreview() {
        if (previewWrap) {
            previewWrap.hidden = true;
        }
        if (previewImage) {
            previewImage.removeAttribute('src');
        }
    }

    function showMeta(meta) {
        if (!metaWrap) {
            return;
        }

        if (metaName) {
            metaName.textContent = sanitizeFileName(meta.name);
        }
        if (metaSize) {
            metaSize.textContent = meta.size;
        }
        if (metaResolution) {
            metaResolution.textContent = `${meta.width} x ${meta.height} px`;
        }

        metaWrap.hidden = false;
    }

    function hideMeta() {
        if (metaWrap) {
            metaWrap.hidden = true;
        }
        if (metaName) {
            metaName.textContent = '-';
        }
        if (metaSize) {
            metaSize.textContent = '-';
        }
        if (metaResolution) {
            metaResolution.textContent = '-';
        }
    }

    function resetValidationVisualState() {
        Object.values(checks).forEach((item) => {
            if (!item) {
                return;
            }

            item.classList.remove('is-pass', 'is-fail');
            item.classList.add('is-pending');
            const dot = item.querySelector('.state-dot');
            if (dot) {
                dot.textContent = '-';
            }
        });
    }

    function resetForm(options = {}) {
        const clearBridge = options.clearBridge === true;
        input.value = '';
        resetValidationVisualState();
        hidePreview();
        hideMeta();
        setContinue(false);
        clearBtn?.setAttribute('disabled', 'disabled');
        setStatus('Selecione um arquivo para iniciar a verificacao.', 'pending');
        clearValidationStorage();
        if (clearBridge) {
            void clearUploadBridge();
        }
    }

    function persistValidationData(payload) {
        try {
            sessionStorage.setItem(VALIDATION_STORAGE_KEY, JSON.stringify(payload));
        } catch (error) {
            // storage failure should not block the flow
        }
    }

    function clearValidationStorage() {
        try {
            sessionStorage.removeItem(VALIDATION_STORAGE_KEY);
        } catch (error) {
            // ignore storage failure
        }
    }

    function openUploadBridgeDb() {
        if (typeof indexedDB === 'undefined') {
            return Promise.resolve(null);
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(UPLOAD_BRIDGE_DB_NAME, 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(UPLOAD_BRIDGE_STORE_NAME)) {
                    db.createObjectStore(UPLOAD_BRIDGE_STORE_NAME);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error('upload_bridge_open_failed'));
        });
    }

    async function runUploadBridgeTx(mode, operation) {
        const db = await openUploadBridgeDb();
        if (!db) {
            return null;
        }

        return new Promise((resolve, reject) => {
            const tx = db.transaction(UPLOAD_BRIDGE_STORE_NAME, mode);
            const store = tx.objectStore(UPLOAD_BRIDGE_STORE_NAME);
            let request = null;
            let result = null;

            try {
                request = operation(store) || null;
            } catch (error) {
                db.close();
                reject(error);
                return;
            }

            if (request) {
                request.onsuccess = () => {
                    result = request.result;
                };
            }

            tx.oncomplete = () => {
                db.close();
                resolve(result);
            };
            tx.onerror = () => {
                db.close();
                reject(tx.error || new Error('upload_bridge_tx_failed'));
            };
            tx.onabort = () => {
                db.close();
                reject(tx.error || new Error('upload_bridge_tx_aborted'));
            };
        });
    }

    async function persistUploadToBridge(file) {
        if (!(file instanceof Blob)) {
            return false;
        }

        const payload = {
            blob: file,
            name: String(file.name || 'arte.png'),
            type: String(file.type || ''),
            lastModified: Number(file.lastModified || Date.now())
        };

        let hasBridgeStorage = false;
        try {
            await runUploadBridgeTx('readwrite', (store) => store.put(payload, UPLOAD_BRIDGE_KEY));
            hasBridgeStorage = true;
        } catch (error) {
            hasBridgeStorage = false;
        }

        const hasSessionStorage = await persistUploadToSessionBridge(file);
        const hasServerStorage = await persistUploadToServerBridge(file);
        return hasBridgeStorage || hasSessionStorage || hasServerStorage;
    }

    async function clearUploadBridge() {
        try {
            await runUploadBridgeTx('readwrite', (store) => store.delete(UPLOAD_BRIDGE_KEY));
        } catch (error) {
            // ignore storage failure
        }

        clearUploadSessionBridge();
        await clearUploadServerBridge();
    }

    async function persistUploadToSessionBridge(file) {
        try {
            const dataUrl = await readFileAsDataUrl(file);
            const payload = {
                dataUrl,
                name: String(file.name || 'arte.png'),
                type: String(file.type || ''),
                lastModified: Number(file.lastModified || Date.now()),
                savedAt: Date.now()
            };
            sessionStorage.setItem(UPLOAD_BRIDGE_SESSION_KEY, JSON.stringify(payload));
            return true;
        } catch (error) {
            return false;
        }
    }

    function clearUploadSessionBridge() {
        try {
            sessionStorage.removeItem(UPLOAD_BRIDGE_SESSION_KEY);
        } catch (error) {
            // ignore storage failure
        }
    }

    async function persistUploadToServerBridge(file) {
        try {
            const form = new FormData();
            form.append('artwork', file, String(file.name || 'artwork.png'));
            const response = await fetch(`${UPLOAD_BRIDGE_ENDPOINT}?action=store`, {
                method: 'POST',
                body: form,
                credentials: 'same-origin',
                cache: 'no-store'
            });

            if (!response.ok) {
                return false;
            }

            const payload = await response.json();
            return Boolean(payload?.ok);
        } catch (error) {
            return false;
        }
    }

    async function clearUploadServerBridge() {
        try {
            await fetch(`${UPLOAD_BRIDGE_ENDPOINT}?action=clear`, {
                method: 'POST',
                credentials: 'same-origin',
                cache: 'no-store'
            });
        } catch (error) {
            // ignore bridge clear failures
        }
    }

    function sanitizeFileName(name) {
        return String(name || '').replace(/[<>"']/g, '').trim() || 'arquivo';
    }

    function formatBytes(bytes) {
        const size = Number(bytes);
        if (!Number.isFinite(size) || size <= 0) {
            return '0 B';
        }

        if (size < 1024) {
            return `${size} B`;
        }

        const units = ['KB', 'MB', 'GB'];
        let value = size / 1024;
        let index = 0;

        while (value >= 1024 && index < units.length - 1) {
            value /= 1024;
            index += 1;
        }

        return `${value.toFixed(1)} ${units[index]}`;
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('preview_failed'));
            reader.readAsDataURL(file);
        });
    }
})();
