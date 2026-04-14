CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    access_level VARCHAR(80) NOT NULL DEFAULT 'Administrador',
    is_general_admin TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    permissions_json LONGTEXT NULL,
    created_by_admin_id INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_users_creator FOREIGN KEY (created_by_admin_id) REFERENCES admin_users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_admin_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS design_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    area_type VARCHAR(30) NOT NULL DEFAULT 'design',
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    description TEXT NULL,
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_design_categories_area_type (area_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reference_price_catalogs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_reference_catalog_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reference_price_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    catalog_id INT UNSIGNED NOT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    group_name VARCHAR(255) NULL,
    reference_code VARCHAR(30) NULL,
    service_name VARCHAR(255) NOT NULL,
    min_price DECIMAL(12, 2) NULL,
    max_price DECIMAL(12, 2) NULL,
    min_price_label VARCHAR(60) NOT NULL,
    max_price_label VARCHAR(60) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'BRL',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reference_items_catalog FOREIGN KEY (catalog_id) REFERENCES reference_price_catalogs (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_reference_items_catalog (catalog_id),
    INDEX idx_reference_items_code (reference_code),
    INDEX idx_reference_items_name (service_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS client_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    phone VARCHAR(40) NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quote_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_user_id INT UNSIGNED NOT NULL,
    project_title VARCHAR(180) NOT NULL,
    scope TEXT NOT NULL,
    desired_deadline_days SMALLINT UNSIGNED NULL,
    requested_availability VARCHAR(150) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pendente',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_quote_requests_client FOREIGN KEY (client_user_id) REFERENCES client_users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_quote_requests_status (status),
    INDEX idx_quote_requests_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quote_request_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quote_request_id INT UNSIGNED NOT NULL,
    reference_price_item_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quote_request_items_request FOREIGN KEY (quote_request_id) REFERENCES quote_requests (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_quote_request_items_reference FOREIGN KEY (reference_price_item_id) REFERENCES reference_price_items (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uq_quote_request_service (quote_request_id, reference_price_item_id),
    INDEX idx_quote_request_items_request (quote_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quote_reports (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quote_request_id INT UNSIGNED NOT NULL,
    admin_user_id INT UNSIGNED NOT NULL,
    subtotal_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
    taxes_total_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_deadline_days SMALLINT UNSIGNED NULL,
    availability_summary VARCHAR(180) NULL,
    report_notes TEXT NULL,
    show_tax_details TINYINT(1) NOT NULL DEFAULT 0,
    valid_until DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_quote_reports_request FOREIGN KEY (quote_request_id) REFERENCES quote_requests (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_quote_reports_admin FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uq_quote_reports_request (quote_request_id),
    INDEX idx_quote_reports_valid_until (valid_until),
    INDEX idx_quote_reports_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quote_report_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quote_report_id INT UNSIGNED NOT NULL,
    reference_price_item_id INT UNSIGNED NULL,
    service_name VARCHAR(255) NOT NULL,
    price_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
    deadline_days SMALLINT UNSIGNED NULL,
    availability_label VARCHAR(120) NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quote_report_items_report FOREIGN KEY (quote_report_id) REFERENCES quote_reports (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_quote_report_items_reference FOREIGN KEY (reference_price_item_id) REFERENCES reference_price_items (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_quote_report_items_report (quote_report_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quote_report_taxes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quote_report_id INT UNSIGNED NOT NULL,
    tax_key VARCHAR(30) NOT NULL,
    tax_label VARCHAR(150) NOT NULL,
    tax_percent DECIMAL(6, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quote_report_taxes_report FOREIGN KEY (quote_report_id) REFERENCES quote_reports (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_quote_report_taxes_report (quote_report_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tax_settings (
    id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
    imposto_label VARCHAR(120) NOT NULL DEFAULT 'Impostos',
    imposto_percent DECIMAL(6, 2) NOT NULL DEFAULT 0,
    taxa_label VARCHAR(120) NOT NULL DEFAULT 'Taxas',
    taxa_percent DECIMAL(6, 2) NOT NULL DEFAULT 0,
    encargo_label VARCHAR(120) NOT NULL DEFAULT 'Encargos tributarios',
    encargo_percent DECIMAL(6, 2) NOT NULL DEFAULT 0,
    legal_notes TEXT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_dispatch_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    context_key VARCHAR(80) NOT NULL,
    recipient_name VARCHAR(180) NULL,
    recipient_email VARCHAR(190) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_preview VARCHAR(255) NULL,
    status VARCHAR(30) NOT NULL,
    error_message VARCHAR(255) NULL,
    related_type VARCHAR(40) NULL,
    related_id INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_dispatch_status (status),
    INDEX idx_email_dispatch_context (context_key),
    INDEX idx_email_dispatch_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_resets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_type VARCHAR(20) NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    email VARCHAR(190) NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    requested_ip VARCHAR(64) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_password_resets_token (token_hash),
    INDEX idx_password_resets_user (user_type, user_id),
    INDEX idx_password_resets_email (email),
    INDEX idx_password_resets_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quotes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    reference_price_item_id INT UNSIGNED NULL,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(190) NOT NULL,
    client_phone VARCHAR(40) NULL,
    project_title VARCHAR(180) NOT NULL,
    scope TEXT NOT NULL,
    complexity TINYINT UNSIGNED NOT NULL DEFAULT 3,
    urgency VARCHAR(20) NOT NULL DEFAULT 'normal',
    deliverables SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    turnaround_days SMALLINT UNSIGNED NULL,
    estimated_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'novo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_quotes_category FOREIGN KEY (category_id) REFERENCES design_categories (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_quotes_reference_item FOREIGN KEY (reference_price_item_id) REFERENCES reference_price_items (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_quotes_email (client_email),
    INDEX idx_quotes_status (status),
    INDEX idx_quotes_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
