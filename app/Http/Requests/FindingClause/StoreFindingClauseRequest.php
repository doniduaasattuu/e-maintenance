<?php

namespace App\Http\Requests\FindingClause;

use App\Models\FindingType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StoreFindingClauseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $typeCodes = FindingType::pluck('code');

        return [
            'code' => [
                'required',
                'string',
                'max:25',
                'unique:finding_clauses,code'
            ],
            'type' => [
                'required',
                Rule::in($typeCodes)
            ],
            'title' => [
                'required',
                'string',
                'max:50',
                'unique:finding_clauses,title'
            ],
            'description' => ['required', 'string', 'max:255'],
        ];
    }
}
