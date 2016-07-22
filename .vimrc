syntax on
set nocompatible
set noswapfile
" set cursorline
set encoding=utf-8
set backspace=indent,eol,start
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'gmarik/Vundle.vim'

Plugin 'scrooloose/nerdtree'

Plugin 'tmhedberg/SimpylFold'

Plugin 'nvie/vim-flake8'
Plugin 'scrooloose/syntastic'

Plugin 'jiangmiao/auto-pairs'
Plugin 'Valloric/YouCompleteMe'

call vundle#end()
filetype plugin indent on

map <F5> :w<cr>:!python3 %<cr>

nnoremap <space> zi 
autocmd FileType python set autoindent
autocmd FileType python set foldmethod=indent

autocmd BufNewFile *.py exec ":call SetTitle()"
func SetTitle()
    if &filetype == 'python'
        call setline(1, "#!/usr/bin/env python")
        call setline(2, "# -*- coding: utf-8 -*-")
        call setline(3, "# Auther: ZhengZhong,Jiang")
    endif
    autocmd BufNewFile * normal G
endfunc

let NERDTreeIgnore=['\.pyc$', '\~$']
map <F2> :NERDTreeMirror<CR>
map <F2> :NERDTreeToggle<CR>

let python_highlight_all=1

let g:ycm_python_binary_path = '/usr/bin/python3'
let g:ycm_seed_identifiers_with_syntax = 1
let g:ycm_autoclose_preview_window_after_completion = 1

" ------------Start Python PEP 8 stuff----------------
au BufRead,BufNewFile *py,*pyw,*.c,*.h set tabstop=4
au BufRead,BufNewFile *.py,*pyw set shiftwidth=4
au BufRead,BufNewFile *.py,*.pyw set expandtab
au BufRead,BufNewFile *.py set softtabstop=4
au BufRead,BufNewFile *.py,*.pyw, set textwidth=100
au BufNewFile *.py,*.pyw,*.c,*.h set fileformat=unix
" ----------Stop python PEP 8 stuff--------------
