<?php

namespace Tests\Support;

use Closure;

class ExportDefinition
{
    public function __construct(
        public readonly Closure $factory,
        public readonly ?Closure $setup,
        public readonly Closure $modelFactory,
        public readonly ?string $title,
        public readonly array $headings,
        public readonly Closure $mappingAssertion,
        public readonly ?Closure $queryAssertion = null,
    ) {}
}
