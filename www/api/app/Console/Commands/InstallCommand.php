<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\QueryException;

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
        for ($i = 0; $i < 6; ++$i) {
            try {
                $this->call('migrate', ['--force' => true]);
                break;
            } catch (QueryException $e) {
                echo ("Error creating database: retrying...\n");
                echo($e->getMessage()."\n");
                sleep(10);
            }
        }
    }
}
