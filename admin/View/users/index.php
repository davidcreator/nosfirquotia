<section class="aq-admin-page-hero">
    <div class="row g-2 align-items-center">
        <div class="col-md-8">
            <h1 class="aq-admin-page-hero-title">Usuários admin e permissões</h1>
            <p class="aq-admin-page-hero-subtitle">Controle de niveis de acesso do painel administrativo.</p>
        </div>
        <div class="col-md-4">
            <div class="aq-admin-page-hero-meta">
                <span class="badge text-bg-light text-dark">Somente Administrador Geral</span>
            </div>
        </div>
    </div>
</section>

<section class="row g-3 mb-4">
    <div class="col-lg-6">
        <div class="aq-admin-panel h-100">
            <div class="aq-admin-panel-header">
                <div>
                    <h2 class="aq-admin-panel-title">Novo usuário administrativo</h2>
                </div>
            </div>
            <div class="aq-admin-panel-body">
                <form method="post" action="<?= e(url('/admin/usuarios')) ?>" class="row g-3">
                    <?= csrf_field() ?>
                    <div class="col-md-6">
                        <label class="form-label">Nome</label>
                        <input class="form-control" name="name" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Senha inicial</label>
                        <input type="password" class="form-control" name="password" minlength="6" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Nivel de acesso</label>
                        <input class="form-control" name="access_level" value="Operacional" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label d-block mb-2">Permissões</label>
                        <div class="row g-2">
                            <?php foreach ($permissionCatalog as $permissionKey => $permissionLabel): ?>
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="newPerm_<?= e($permissionKey) ?>" name="permissions[]" value="<?= e($permissionKey) ?>">
                                        <label class="form-check-label" for="newPerm_<?= e($permissionKey) ?>"><?= e($permissionLabel) ?></label>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="newIsActive" name="is_active" value="1" checked>
                            <label class="form-check-label" for="newIsActive">Conta ativa</label>
                        </div>
                    </div>
                    <div class="col-12 d-flex justify-content-end">
                        <button class="btn btn-primary" type="submit">Criar usuário admin</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="col-lg-6">
        <div class="aq-admin-panel h-100">
            <div class="aq-admin-panel-header">
                <div>
                    <h2 class="aq-admin-panel-title">Regras de segurança</h2>
                </div>
            </div>
            <div class="aq-admin-panel-body">
                <ul class="mb-0">
                    <li>Administrador Geral tem acesso total ao sistema.</li>
                    <li>Somente Administrador Geral pode alterar permissões de outros admins.</li>
                    <li>Contas inativas não conseguem efetuar login.</li>
                    <li>Ajuste o nível de acesso por módulo conforme a função de cada usuário.</li>
                    <li>Evite compartilhar contas, mantenha um usuário por pessoa.</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<section class="aq-admin-panel">
    <div class="aq-admin-panel-header">
        <div>
            <h2 class="aq-admin-panel-title">Usuários existentes</h2>
            <p class="aq-admin-panel-subtitle">Atualize status, senha e permissões por perfil.</p>
        </div>
    </div>
    <div class="aq-admin-panel-body">
        <?php if ($users === []): ?>
            <div class="alert alert-info mb-0">Nenhum usuário administrativo cadastrado.</div>
        <?php else: ?>
            <div class="vstack gap-3">
                <?php foreach ($users as $user): ?>
                    <?php
                    $userId = (int) $user['id'];
                    $isGeneral = !empty($user['is_general_admin']);
                    $isActive = !empty($user['is_active']);
                    $userPermissions = is_array($user['permissions'] ?? null) ? $user['permissions'] : [];
                    ?>
                    <article class="aq-admin-user-article">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <strong><?= e((string) $user['name']) ?></strong>
                                <span class="text-muted">#<?= $userId ?> - <?= e((string) $user['email']) ?></span>
                            </div>
                            <div class="d-flex gap-2">
                                <?php if ($isGeneral): ?>
                                    <span class="badge text-bg-primary">Administrador Geral</span>
                                <?php else: ?>
                                    <span class="badge text-bg-secondary"><?= e((string) ($user['access_level'] ?? 'Administrador')) ?></span>
                                <?php endif; ?>
                                <?php if ($isActive): ?>
                                    <span class="badge text-bg-success">Ativo</span>
                                <?php else: ?>
                                    <span class="badge text-bg-danger">Inativo</span>
                                <?php endif; ?>
                            </div>
                        </div>

                        <form method="post" action="<?= e(url('/admin/usuarios/' . $userId)) ?>" class="row g-3">
                            <?= csrf_field() ?>
                            <div class="col-md-4">
                                <label class="form-label">Nome</label>
                                <input class="form-control" name="name" value="<?= e((string) $user['name']) ?>" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" name="email" value="<?= e((string) $user['email']) ?>" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Nivel de acesso</label>
                                <input class="form-control" name="access_level" value="<?= e((string) ($user['access_level'] ?? 'Administrador')) ?>" <?= $isGeneral ? 'readonly' : '' ?> required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nova senha (opcional)</label>
                                <input type="password" class="form-control" name="new_password" minlength="6" placeholder="Deixe em branco para manter a senha atual">
                            </div>
                            <div class="col-md-6 d-flex align-items-end">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="isActive_<?= $userId ?>" name="is_active" value="1" <?= $isActive ? 'checked' : '' ?> <?= $isGeneral ? 'disabled' : '' ?>>
                                    <label class="form-check-label" for="isActive_<?= $userId ?>">Conta ativa</label>
                                </div>
                            </div>
                            <?php if ($isGeneral): ?>
                                <div class="col-12">
                                    <div class="alert alert-light border mb-0">
                                        Este usuário foi definido como Administrador Geral (instalador) e possui acesso total fixo.
                                    </div>
                                </div>
                            <?php else: ?>
                                <div class="col-12">
                                    <label class="form-label d-block mb-2">Permissões</label>
                                    <div class="row g-2">
                                        <?php foreach ($permissionCatalog as $permissionKey => $permissionLabel): ?>
                                            <div class="col-md-6">
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="perm_<?= $userId ?>_<?= e($permissionKey) ?>"
                                                        name="permissions[]"
                                                        value="<?= e($permissionKey) ?>"
                                                        <?= in_array($permissionKey, $userPermissions, true) ? 'checked' : '' ?>
                                                    >
                                                    <label class="form-check-label" for="perm_<?= $userId ?>_<?= e($permissionKey) ?>">
                                                        <?= e($permissionLabel) ?>
                                                    </label>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <div class="col-12 d-flex justify-content-end">
                                <button class="btn btn-outline-primary btn-sm" type="submit">Salvar configurações</button>
                            </div>
                        </form>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>
