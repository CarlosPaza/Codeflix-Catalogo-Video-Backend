<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\GenreResource;
use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends BasicCrudController
{
    private $rules = [
        'name' => 'required|max:255',
        'is_active' => 'boolean',
        'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL',
    ];

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $self = $this;
        $obj = \DB::transaction(function () use ($self, $request, $validatedData) {
            $obj = $this->model()::create($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $self = $this;
        \DB::transaction(function () use ($self, $request, $obj, $validatedData) {
            $obj->update($validatedData);
            $self->handleRelations($obj, $request);
        });
        $resource = $this->resource();
        return new $resource($obj);
    }

    protected function handleRelations($obj, Request $request)
    {
        $obj->categories()->sync($request->get('categories_id'));
    }

    public function model()
    {
        return Genre::class;
    }

    public function rulesStore()
    {
        return $this->rules;
    }

    public function rulesUpdate()
    {
        return $this->rules;
    }

    protected function resource()
    {
        return GenreResource::class;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }
}
