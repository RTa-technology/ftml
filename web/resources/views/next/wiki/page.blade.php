{{--
    `$page_breadcrumbs` is an array with the following structure:
        $page_breadcrumbs = [
            [
                'title' => 'parent-title',
                'slug' => '/parent-slug',
            ]
            ...
        ]

    data:
        $page_category
        $page_title
        $page_alt_title
        $page_breadcrumbs
        $page_content (UNESCAPED)
        $page_revision
        $page_last_edit_timestamp (int)
        $page_tags (array of strings)
--}}

@extends('next.frame')

@push('preloads')
    @preload('wiki.scss')
@endpush

@push('styles')
    @vite('wiki.scss')
@endpush

@php
    $page_show_info_div =
           isset($page_tags)
        || isset($page_category)
        || isset($page_revision)
        || isset($page_last_edit_timestamp);
@endphp

@section('content')
    <article id="page">
        @isset($page_title)
            <h1 id="page_title">{{ $page_title }}</h1>
            @isset($page_alt_title)
                <h2 id="page_alt_title">{{ $page_alt_title }}</h2>
            @endisset
            <hr>
        @endisset

        @if (isset($page_breadcrumbs) && count($page_breadcrumbs) > 0)
            <div id="page_breadcrumbs" aria-label="{{ __('breadcrumbs') }}">
                <ul>
                    @foreach ($page_breadcrumbs as $breadcrumb)
                        <li class="page-breadcrumb">
                            <a href="{{ $breadcrumb['slug'] }}">{{ $breadcrumb['title'] }}</a>
                        </li>
                        <li aria-hidden="true">
                            <span class="page-breadcrumb-sep">/</span>
                        </li>
                    @endforeach
                    <li class="page-breadcrumb is-last">
                        <span>{{ $page_title }}</span>
                    </li>
                </ul>
            </div>
        @endif

        <div id="page_content">
            {!! $page_content !!}
        </div>

        @if ($page_show_info_div)
            <div id="page_info">
                {{-- We'll keep the element here even with no tags --}}
                {{-- This is to preserve the layout needed for styling --}}
                <h4 id="page_info_tags_header" aria-hidden="true">
                    @if (isset($page_tags) && count($page_tags) > 0)
                        {{ __('tags') }}
                    @endif
                </h4>

                @isset($page_category)
                    <span id="page_info_category">
                        {{ __('wiki-page-category', ['category' => $page_category]) }}
                    </span>

                    <span class="page-info-sep">|</span>
                @endisset


                @isset($page_revision)
                    <span id="page_info_revision">
                        {{ __('wiki-page-revision', ['revision' => $page_revision]) }}
                    </span>

                    <span class="page-info-sep">|</span>
                @endisset

                @isset($page_last_edit_timestamp)
                    @php
                        $ts = $page_last_edit_timestamp;
                        $date_formatted = strftime('%x %r', $ts);
                        $days_ago = floor((time() - $ts) / (60 * 60 * 24));
                    @endphp
                    <span id="page_info_last_edit">
                        {{ __('wiki-page-last-edit', [
                            'date' => $date_formatted,
                            'days' => $days_ago,
                        ]) }}
                    </span>
                @endisset
            </div>
        @endif

        <hr>

        @if (isset($page_tags) && count($page_tags) > 0)
            <div id="page_tags" aria-label="{{ __('tags') }}">
                <ul>
                    @foreach($page_tags as $tag)
                        <li class="page-tag">
                            <a href="/system:page-tags/tag/{{ $tag }}">
                                {{ $tag }}
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>
        @endif
    </article>
@endsection
