<?php

namespace App\Console\Commands;

use App\Models\Repository;
use Illuminate\Console\Command;

class RenameRepositoryFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:rename-repository-files';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $repositories = Repository::all();

        $bar = $this->output->createProgressBar($repositories->count());

        $bar->start();

        foreach ($repositories as $repository) {

            if (! Storage::disk('public')->exists($repository->path)) {
                $this->newLine();
                $this->warn("File not found: {$repository->path}");
                $bar->advance();
                continue;
            }

            $newPath = 'repositories/' .
                Str::slug($repository->title) .
                '.' .
                $repository->extension;

            if ($repository->path !== $newPath) {

                Storage::disk('public')->move(
                    $repository->path,
                    $newPath
                );

                $repository->update([
                    'path' => $newPath,
                ]);
            }

            $bar->advance();
        }

        $bar->finish();

        $this->newLine();
        $this->info('All repository files have been renamed successfully.');

        return self::SUCCESS;
    }
}
