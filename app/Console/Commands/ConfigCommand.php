<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class ConfigCommand extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'api:config';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates .env settings file';

    /**
     * The filesystem instance.
     *
     * @var \Illuminate\Filesystem\Filesystem
     */
    protected $files;

    protected const defaults = [
        'APP_NAME' => 'Lumen', // Lumen,
        'APP_ENV' => null, //production,
        'APP_KEY' => null, //AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDD,
        'APP_DEBUG' => null,
        'APP_URL' => null, // http://localhost/,
        'APP_TIMEZONE' => 'UTC',
        1=>null,

        'DB_CONNECTION' => null,
        'DB_HOST' => null,
        'DB_PORT' => null,
        'DB_DATABASE' => null,
        'DB_USERNAME' => null,
        'DB_PASSWORD' => null,
        2=>null,

        'CACHE_DRIVER' => 'database',
        'QUEUE_CONNECTION' => 'sync',
        3=>null,

        'JWT_SECRET' => null,
        'JWT_TTL' => 3600,
        'JWT_REFRESH_TTL' => 3600,
    ];

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

    private static function getValue($val)
    {
        if (is_bool($val)) return $val ? 'true' : 'false';
        return strval($val);
    }

    public function askRequired($question, $default = null)
    {
        $ret = $this->ask($question, $default);
        if (strval($ret) == '') {
            $this->error('a value is required!');
            return $this->askRequired($question, $default);
        }
        return $ret;
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
        $data = self::defaults;

        $data['APP_URL'] = $this->ask('Root url of application', 'localhost');

        $data['APP_ENV'] = $this->confirm('Production Environment?', true) ? 'production' : 'local';
        $data['APP_DEBUG'] = $this->confirm('Activate Debug Mode?');

        $data['DB_CONNECTION'] = explode('- ', $this->choice("what SQL DB type do you use?", [
            'SQLite - sqlite',
            'MySQL - mysql',
            'Postgres - pgsql',
            'SQL Server - sqlsrv'
        ]))[1];

        $data['DB_HOST'] = $this->ask('Enter SQL Host', 'localhost');
        $data['DB_PORT'] = $this->ask('Enter SQL Port', 3306);

        $data['DB_DATABASE'] = $this->askRequired('Enter SQL Database Name');

        $data['DB_USERNAME'] = $this->askRequired('Enter SQL Database Username');
        $data['DB_PASSWORD'] = $this->ask('Enter SQL Database Password');

        while (true) {
            $val = $this->ask('Enter Application Key:', str_random(32));
            if (strlen($val) == 32) {
                $data['APP_KEY'] = $val;
                break;
            }
            $this->error("An application key must have 32 characters!");
        }

        $data['JWT_SECRET'] = $this->ask('Enter JWT Key:', str_random(64));

        $path = './.env';

        $this->files->put($path, '');
        $tbl = [];
        foreach ($data as $key => $value) {
            if (is_int($key)) {
                $tbl[] = ['',''];
                $this->files->append($path, PHP_EOL);
                continue;
            }
            $tbl[] = [$key, self::getValue($value)];
            $this->files->append($path, "$key=" . self::getValue($value) . PHP_EOL);
        }
        $this->info('Configuration created successfully!');
        $this->table(['key', 'value'], $tbl);

        $this->info("Application Key: '" . $data['APP_KEY'] . "'");
    }
}
