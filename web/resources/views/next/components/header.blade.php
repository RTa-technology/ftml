{{--
    Header for most pages.

    data:
        $header_img_url
        $header_title
        $header_subtitle
 --}}

<header id="header" class="dark" aria-label="{{ __('header') }}">
    @if (isset($header_img_url) || isset($header_title))
        <a id="header_logo" href="/" title="{{ __('goto-home') }}">
            @isset($header_img_url)
                <img id="header_logo_img"
                      src="{{ $header_img_url }}"
                      aria-hidden="true"
                >
            @endisset
            @isset($header_title)
                <h1 id="header_logo_title">{{ $header_title }}</h1>
            @endisset
            @isset($header_subtitle)
                <small id="header_logo_subtitle">{{ $header_subtitle }}</small>
            @endisset
        </a>
    @endif

    {{-- only gets displayed on large screens --}}
    <wj-component-loader ld-load="ClientStatus">
    </wj-component-loader>
</header>
