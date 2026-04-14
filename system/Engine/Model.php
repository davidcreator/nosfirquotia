<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Engine;

use NosfirQuotia\System\Library\Database;

abstract class Model
{
    protected Database $db;

    public function __construct(protected readonly Application $app)
    {
        $this->db = $app->db();
    }
}
