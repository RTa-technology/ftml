@extends('next.base')

@push('scripts')
    @vite('editor-test.ts')
@endpush

@section('app')
    <div id="app-editor"></div>
@endsection
