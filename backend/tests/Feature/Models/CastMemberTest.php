<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use \Ramsey\Uuid\Uuid as RamseyUuid;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(CastMember::class, 1)->create();
        $castMembers = CastMember::all();
        $this->assertCount(1, $castMembers);
        $castMemberKey = array_keys($castMembers->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'type',
                'created_at',
                'updated_at',
                'deleted_at'
            ],
            $castMemberKey
        );
    }

    public function testCreate()
    {
        $castMember = CastMember::create(['name' => 'test1', 'type' => CastMember::TYPE_DIRECTOR]);
        $castMember->refresh();
        $this->assertEquals(36, strlen($castMember->id));
        $this->assertEquals('test1', $castMember->name);

        $castMember = CastMember::create(['name' => 'test1', 'type' => CastMember::TYPE_DIRECTOR]);
        $this->assertEquals($castMember->type, CastMember::TYPE_DIRECTOR);
    }

    public function testUpdate()
    {
        $castMember = factory(CastMember::class)->create([
            'type' => CastMember::TYPE_DIRECTOR
        ]);
        $data = [
            'name' => 'test_name_updated',
            'type' => CastMember::TYPE_ACTOR
        ];
        $castMember->update($data);
        foreach ($data as $key => $value) {
            $this->assertEquals($value, $castMember->{$key});
        }
    }

    public function testDelete()
    {
        $castMember = factory(CastMember::class)->create([
            'name' => 'test1',
            'type' => CastMember::TYPE_ACTOR
        ])->first();
        $castMember->delete();
        $this->assertSoftDeleted('cast_members', [
            'id' => $castMember->id
        ]);
    }

    public function testUuid()
    {
        $castMember = factory(CastMember::class)->create([
            'name' => 'test1',
            'type' => CastMember::TYPE_ACTOR
        ])->first();
        $this->assertTrue(RamseyUuid::isValid($castMember->id));
    }
}