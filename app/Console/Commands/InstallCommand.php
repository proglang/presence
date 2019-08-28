<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class InstallCommand extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'api:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Installs application';


    /**
     * Create a new config cache command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
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
        if ($this->confirm('Create new Config?', true))
            $this->call('lumen:config');
        if ($this->confirm('Install Database?', true))
            $this->call('migrate:fresh', ['--force' => true]);
    }
}
