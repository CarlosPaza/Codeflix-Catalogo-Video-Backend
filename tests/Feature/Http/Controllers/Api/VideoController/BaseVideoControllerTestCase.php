<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestSaves;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

abstract class BaseVideoControllerTestCase extends TestCase
{
    use DatabaseMigrations;

    protected $video;
    protected $sendData;

    protected function setUp(): void
    {
        parent::setup();
        $this->video = factory(Video::class)->create([
            'opened' => false
        ]);
        $this->sendData = [
            'title' => 'title',
            'description' => 'description',
            'year_launched' => 1992,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90,
        ];
    }
}