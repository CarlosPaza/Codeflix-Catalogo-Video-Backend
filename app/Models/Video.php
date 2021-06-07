<?php

namespace App\Models;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use SoftDeletes, Traits\Uuid, UploadFiles;

    const RATING_LIST = ['L', '10', '12', '14', '16', '18'];
    const VIDEO_FILE_MAX_SIZE = 1024 * 50;

    protected $fillable = [
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration'
    ];
    protected $dates = ['deleted_at'];
    protected $casts = [
        'id' => 'string',
        'opened' => 'boolean',
        'year_launched' => 'integer',
        'duration' => 'integer'
    ];
    public $incrementing = false;

    public static $fileFields = [
        'video_file'
    ];

    public static function create(array $attributes = [])
    {
        $files = self::extractFiles($attributes);
        try {
            \DB::beginTransaction();
            /** @var Video $obj */
            $obj = static::query()->create($attributes);
            static::handleRelations($obj, $attributes);
            $obj->uploadFiles($files);
            \DB::commit();
            return $obj;
        } catch (\Exception $e) {
            if (isset($obj)) {
                // excluir os arquivos de uploads
            }
            \DB::rollBack();
            throw $e;
        }
    }

    public function update(array $attributes = [], array $options = [])
    {
        try {
            \DB::beginTransaction();
            $saved = parent::update($attributes, $options);
            static::handleRelations($this, $attributes);
            if ($saved) {
                // faz o upload
                // excluir os antigos
            }
            \DB::commit();
            return $saved;
        } catch (\Exception $e) {
            // excluir os arquivos de uploads
            \DB::rollBack();
            throw $e;
        }
    }

    public static function handleRelations($obj, array $attributes)
    {
        if (isset($attributes["categories_id"])) {
            $obj->categories()->sync($attributes["categories_id"]);
        }
        if (isset($attributes["genres_id"])) {
            $obj->genres()->sync($attributes["genres_id"]);
        }
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }

    protected function uploadDir()
    {
        return $this->id;
    }
}
