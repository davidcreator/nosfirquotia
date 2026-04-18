<?php
$mockupScriptPath = __DIR__ . '/../js/script.js';
$mockupScriptVersion = is_file($mockupScriptPath) ? (string) filemtime($mockupScriptPath) : '1';
?>
<footer class="footer">
        <div class="container">
            <p>&copy; 2025 MockupHub. Ferramenta para criação de mockups profissionais.</p>
        </div>
    </footer>

    <div class="modal" id="previewModal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <img id="previewImage" src="" alt="Preview">
            <div class="modal-actions">
                <button type="button" class="btn-primary" onclick="usePreviewedMockup()">Usar Este Mockup</button>
                <button type="button" class="btn-secondary" onclick="closeModal()">Fechar</button>
            </div>
        </div>
    </div>

    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js?v=<?php echo htmlspecialchars($mockupScriptVersion, ENT_QUOTES, 'UTF-8'); ?>"></script>
</body>
</html>
