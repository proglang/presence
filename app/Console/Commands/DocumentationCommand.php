<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class DocumentationCommand extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'api:docu';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create Documentation Markdown';


    /**
     * The filesystem instance.
     *
     * @var \Illuminate\Filesystem\Filesystem
     */
    protected $files;

    /**
     * Create a new config cache command instance.
     *
     * @param  \Illuminate\Filesystem\Filesystem  $files
     * @return void
     */
    public function __construct(Filesystem $files)
    {
        parent::__construct();

        $this->files = $files;
    }

    /**
     * Execute the console command.
     *
     * @return void
     *
     * @throws \LogicException
     */
    public function handle()
    {
        $readme = "./Readme.md";
        $this->files->put($readme, "#API - Readme" . PHP_EOL . PHP_EOL);
        foreach ($this->files->files("./_docu/md") as $file) {
            $data = $this->files->get($file);
            $this->files->append($readme, $data . PHP_EOL);
        }

        $api = "./API.md";
        $this->files->put($api, "#API" . PHP_EOL . PHP_EOL);
        foreach ($this->files->files("./_docu/API") as $file) {
            $data = $this->files->get($file);
            $this->files->append($api, $data . PHP_EOL);
        }
    }
}
