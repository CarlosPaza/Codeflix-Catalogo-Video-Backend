<?php

namespace Tests\Feature\Models\Traits;

use Storage;
use Tests\Stubs\Models\UploadFilesStub;
use Tests\TestCase;

class UploadFilesTest extends TestCase
{
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFilesStub();
        UploadFilesStub::dropTable();
        UploadFilesStub::makeTable();
    }

    public function testMakeOldFilesOnSaving()
    {
        Storage::fake();
        $this->obj->fill([
            "name" => "test",
            "file" => "test1.mp4",
            "file2" => "test2.mp4",
        ]);
        $this->obj->save();
        $this->assertCount(0, $this->obj->oldFiles);

        $this->obj->update([
            "name" => "test_name",
            "file2" => "test3.mp4"
        ]);
        $this->assertEqualsCanonicalizing(["test2.mp4"], $this->obj->oldFiles);
    }

    public function testMakeOldFilesNullOnSaving()
    {
        Storage::fake();
        $this->obj->fill(["name" => "test"]);
        $this->obj->save();

        $this->obj->update([
            "name" => "test_name",
            "file2" => "test3.mp4"
        ]);
        $this->assertEqualsCanonicalizing([], $this->obj->oldFiles);
    }
}