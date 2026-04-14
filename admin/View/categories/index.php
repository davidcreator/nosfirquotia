<section class="mb-3">
    <h1 class="h3 mb-1">Categorias de Orcamento</h1>
    <p class="text-muted mb-0">Gerencie os tipos de trabalho em Design e Desenvolvimento.</p>
</section>

<section class="row g-3">
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <h2 class="h5 mb-3">Nova categoria</h2>
                <form method="post" action="<?= e(url('/admin/categorias')) ?>" class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Area</label>
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
                        <label class="form-label">Descricao</label>
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
        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table mb-0 align-middle">
                    <thead class="table-light">
                    <tr>
                        <th>Area</th>
                        <th>Nome</th>
                        <th>Descricao</th>
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
