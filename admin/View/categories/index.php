<section class="aq-admin-page-hero">
    <div class="row g-2 align-items-center">
        <div class="col-md-8">
            <h1 class="aq-admin-page-hero-title">Categorias de orçamento</h1>
            <p class="aq-admin-page-hero-subtitle">Gerencie os tipos de trabalho em Design e Desenvolvimento.</p>
        </div>
        <div class="col-md-4">
            <div class="aq-admin-page-hero-meta">
                <span class="aq-admin-link-chip"><i class="fa-solid fa-tags"></i> Catalogo interno</span>
            </div>
        </div>
    </div>
</section>

<section class="row g-3">
    <div class="col-lg-5">
        <div class="aq-admin-panel h-100">
            <div class="aq-admin-panel-header">
                <div>
                    <h2 class="aq-admin-panel-title">Nova categoria</h2>
                </div>
            </div>
            <div class="aq-admin-panel-body">
                <form method="post" action="<?= e(url('/admin/categorias')) ?>" class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Área</label>
                        <select class="form-select" name="area_type" required>
                            <option value="design">Design</option>
                            <option value="development">Desenvolvimento</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Nome</label>
                        <input class="form-control" name="name" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Descrição</label>
                        <textarea class="form-control" name="description" rows="3"></textarea>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Preco base (R$)</label>
                        <input type="number" step="0.01" min="0.01" class="form-control" name="base_price" required>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-primary" type="submit">Salvar categoria</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="col-lg-7">
        <div class="aq-admin-panel aq-admin-table-card">
            <div class="aq-admin-panel-header">
                <div>
                    <h2 class="aq-admin-panel-title">Categorias cadastradas</h2>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table mb-0 align-middle">
                    <thead class="table-light">
                    <tr>
                        <th>Área</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preco Base</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($categories as $category): ?>
                        <tr>
                            <td>
                                <?php $isDevelopment = (string) ($category['area_type'] ?? 'design') === 'development'; ?>
                                <span class="badge <?= $isDevelopment ? 'text-bg-info' : 'text-bg-secondary' ?>">
                                    <?= $isDevelopment ? 'Desenvolvimento' : 'Design' ?>
                                </span>
                            </td>
                            <td><?= e($category['name']) ?></td>
                            <td><?= e((string) $category['description']) ?></td>
                            <td>R$ <?= number_format((float) $category['base_price'], 2, ',', '.') ?></td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
