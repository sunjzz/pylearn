"vundle
set nocompatible
filetype off

set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'VundleVim/Vundle.vim'

"filesystem
Plugin 'scrooloose/nerdtree'

"html
Plugin 'isnowfy/python-vim-instant-markdown'
Plugin 'jtratner/vim-flavored-markdown'
Plugin 'suan/vim-instant-markdown'
Plugin 'nelstrom/vim-markdown-preview'

"python sytax checker
Plugin 'scrooloose/syntastic'
Plugin 'nvie/vim-flake8'

"auto-completion stuff
Plugin 'Valloric/YouCompleteMe'

" code folding
Plugin 'tmhedberg/SimpylFold'

"Colors!!!
Plugin 'jnurmine/Zenburn'

call vundle#end()

" global
" <F5> 运行python程序  
map <F5> :w<cr>:!python3 %<cr>  

filetype plugin indent on

colorscheme zenburn
"set guifont=Monaco:h14

"I don't like swap files
set noswapfile

"turn on numbering
set nu

" 添加头部注释
autocmd BufNewFile *.py exec ":call SetTitle()"
func SetTitle()
    if &filetype == 'python'
        call setline(1, "#!/usr/bin/env python")
        call setline(2, "# -*- coding: utf-8 -*-")
        call setline(3, "# Auther: ZhengZhong,Jiang")
    endif
    autocmd BufNewFile * normal G
endfunc

" enables filetype detection
filetype plugin indent on
let g:SimpylFold_docstring_preview = 1

" plugin NerdTree
let NERDTreeIgnore=['\.pyc$', '\~$'] "ignore files in NERDTree
map <F2> :NERDTreeMirror<CR>
map <F2> :NERDTreeToggle<CR>

" plugin youcompleteme
let g:ycm_python_binary_path = '/usr/bin/python3'

let g:ycm_key_list_select_completion = ['<TAB>', '<Down>'] " TAB 自动补全
let g:ycm_key_list_previous_completion = ['<S-TAB>', '<Up>'] 
 
let g:ycm_min_num_of_chars_for_completion=2	" 从第2个键入字符就开始罗列匹配项
let g:ycm_cache_omnifunc=0	" 禁止缓存匹配项,每次都重新生成匹配项
let g:ycm_seed_identifiers_with_syntax=1	" 语法关键字补全
let g:ycm_complete_in_comments = 1  " 在注释输入中也能补全
let g:ycm_complete_in_strings = 1 " 在字符串输入中也能补全
let g:ycm_collect_identifiers_from_comments_and_strings = 0 " 注释和字符串中的文字也会被收入补全
nnoremap <leader>jd :YcmCompleter GoToDefinitionElseDeclaration<CR> " 跳转到定义处 

let mapleader=" "
map <leader>g :YcmCompleter GoToDefinitionElseDeclaration<CR>

"omnicomplete
autocmd FileType python set omnifunc=pythoncomplete#Complete

"------------Start Python PEP 8 stuff----------------
" Number of spaces that a pre-existing tab is equal to.
au BufRead,BufNewFile *py,*pyw,*.c,*.h set tabstop=4

"spaces for indents
au BufRead,BufNewFile *.py,*pyw set shiftwidth=4
au BufRead,BufNewFile *.py,*.pyw set expandtab
au BufRead,BufNewFile *.py set softtabstop=4

" Wrap text after a certain number of characters
au BufRead,BufNewFile *.py,*.pyw, set textwidth=100

" Use UNIX (\n) line endings.
au BufNewFile *.py,*.pyw,*.c,*.h set fileformat=unix

" Set the default file encoding to UTF-8:
set encoding=utf-8

" For full syntax highlighting:
let python_highlight_all=1
syntax on

" Keep indentation level from previous line:
autocmd FileType python set autoindent

" make backspaces more powerfull
set backspace=indent,eol,start

"Folding based on indentation:
autocmd FileType python set foldmethod=indent

"use space to open folds
nnoremap <space> za 
"----------Stop python PEP 8 stuff--------------

"js stuff"
autocmd FileType javascript setlocal shiftwidth=2 tabstop=2
