<?php
namespace APP\Repositories;
use Illuminate\Database\Eloquent\Model;
use App\Exceptions\DBException;

abstract class BaseDatabaseRepository {
    abstract public function isValid():bool;
    protected function assertValid() {
        if ($this->isValid()) return;
        throw new DBException("invalid",500, "Data not valid!", get_class($this));
    }
    static protected function save(Model $data) {
        if ($data->save()) return;
        throw new DBException("save",500, "Could not save data!", get_class($data));
    }
}