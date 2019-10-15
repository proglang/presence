<?php

//! Source: https://medium.com/@mamreezaa/lumen-new-artisan-command-to-list-all-api-endpoints-de7602731a14
/**
 * @package     Product
 * @author      mAm <mamreezaa@gmail.com>
 */

namespace App\Console\Commands;

use Illuminate\Console\Command;
/**
 * Class RouteList
 * @package App\Console\Commands
 */
class RouteList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api:list';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List of routes.';
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        global $app;
        $headers = ['method', 'uri', 'uses', 'resource', 'middleware'];
        $body = [];
        foreach ($app->router->getRoutes() as $route) {
            $body[] = $this->getRouteData($route);
        }
        $this->table($headers, $body);
    }
    /**
     * @param $route
     * @return array
     */
    protected function getRouteData($route)
    {
        return [
            !empty($route['method']) ? $route['method'] : 'undefined',
            !empty($route['uri']) ? $route['uri'] : 'undefined',
            !empty($route['action']['uses']) ? $route['action']['uses'] : 'undefined',
            !empty($route['action']['res']) ? $route['action']['res'] : '',
            !empty($route['action']['middleware']) ? implode(',', $route['action']['middleware']) : '',
        ];
    }
}