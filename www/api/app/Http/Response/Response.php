<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Response;

use Illuminate\Http\Resources\Json\Resource;

class Response extends \Illuminate\Http\Response
{
    protected $json = [];
    protected function update()
    {
        if (!empty($this->json)) {
            parent::setContent($this->json);
        }
        return $this;
    }

    public function addJson(string $key, $data) {
        $this->json[$key] = $data;
        $this->update();
        return $this;
    }
    public function addJsonArray(string $key, $data) {
        if (!isset($this->json[$key])) {
            $this->json[$key] = [];
        }
        $this->json[$key][] = $data;
        $this->update();
        return $this;
    }
    public function addResource(Resource $res)
    {
        $this->json[$res::$wrap] = $res;
        $this->update();
        return $this;
    }
    public function addResourceArray(Resource $res, string $name = null)
    {
        if ($name == null) {
            $name = $res::$wrap . "s";
        }
        if (!isset($this->json[$name])) {
            $this->json[$name] = [];
        }
        $this->json[$name][] = $res;
        $this->update();
        return $this;
    }
}
