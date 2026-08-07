<?php

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithTitle;
use Tests\Support\ExportDefinition;

describe('Export Contract', function () {

    it('returns correct headings', function (ExportDefinition $definition) {

        if ($definition->setup) {
            ($definition->setup)($this);
        }

        $context = ($definition->modelFactory)();

        $export = ($definition->factory)($context);

        expect($export->headings())
            ->toBe($definition->headings);
    })->with('exports');

    it('returns export data', function (ExportDefinition $definition) {

        if ($definition->setup) {
            ($definition->setup)($this);
        }

        $context = ($definition->modelFactory)();

        $export = ($definition->factory)($context);

        if ($export instanceof FromQuery) {

            expect($export->query()->count())
                ->toBeGreaterThan(0);

            return;
        }

        if ($export instanceof FromCollection) {

            expect($export->collection())
                ->not->toBeEmpty();

            return;
        }

        $this->fail('Export must implement FromQuery or FromCollection');
    })->with('exports');

    it('maps model correctly', function (ExportDefinition $definition) {

        if ($definition->setup) {
            ($definition->setup)($this);
        }

        $context = ($definition->modelFactory)();

        $export = ($definition->factory)($context);

        ($definition->mappingAssertion)(
            $export,
            $context
        );
    })->with('exports');

    it('returns worksheet title', function (ExportDefinition $definition) {

        if ($definition->setup) {
            ($definition->setup)($this);
        }

        $context = ($definition->modelFactory)();

        $export = ($definition->factory)($context);

        if (! $export instanceof WithTitle) {
            $this->markTestSkipped('Export does not implement WithTitle.');
        }

        expect($export->title())
            ->toBe($definition->title);
    })->with('exports');
});
