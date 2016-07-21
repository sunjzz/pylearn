set nocompatible
set noswapfile
set cursorline
set encoding=utf-8
set foldmethod=indent
set completeopt-=preview
" set completeopt=longest,menu,preview
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'gmarik/Vundle.vim'

Plugin 'scrooloose/nerdtree'

Plugin 'tmhedberg/SimpylFold'

Plugin 'jiangmiao/auto-pairs'

Plugin 'scrooloose/syntastic'
Plugin 'nvie/vim-flake8'

Plugin 'yssource/python.vim'
Plugin 'davidhalter/jedi-vim'
Plugin 'Valloric/YouCompleteMe'

call vundle#end()
filetype plugin indent on

let g:SimpylFold_docstring_preview = 0

nnoremap <space> zi 

let g:ycm_python_binary_path = '/usr/bin/python3'
let g:ycm_seed_identifiers_with_syntax = 1
" let g:ycm_autoclose_preview_window_after_completion = 1
" map <leader>g  :YcmCompleter GoToDefinitionElseDeclaration<CR>

autocmd BufNewFile *.py exec ":call SetTitle()"
func SetTitle()
    if &filetype == 'python'
        call setline(1, "#!/usr/bin/env python")
        call setline(2, "# -*- coding: utf-8 -*-")
        call setline(3, "# Auther: ZhengZhong,Jiang")
    endif
    autocmd BufNewFile * normal G
endfunc

let NERDTreeIgnore=['\.pyc$', '\~$'] "ignore files in NERDTree
map <F2> :NERDTreeMirror<CR>
map <F2> :NERDTreeToggle<CR>

