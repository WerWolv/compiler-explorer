// Copyright (c) 2024, WerWolv
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
import * as monaco from 'monaco-editor';

function definition(): monaco.languages.IMonarchLanguage {
    // Pattern Language language definition

    return {
        keywords: [
            'using',
            'struct',
            'union',
            'enum',
            'bitfield',
            'be',
            'le',
            'if',
            'else',
            'match',
            'false',
            'true',
            'this',
            'parent',
            'addressof',
            'sizeof',
            'typenameof',
            'while',
            'for',
            'fn',
            'return',
            'break',
            'continue',
            'namespace',
            'in',
            'out',
            'ref',
            'null',
            'const',
            'unsigned',
            'signed',
            'try',
            'catch',
            'import',
            'as',
            'from',
        ],
        operators: ['=', '+', '-', '*', '/', '<', '>', '@', '$', '~', '&', '%', '|', '!', '?', '^', '.', ':', '\\'],
        wordOperators: ['addressof', 'sizeof', 'typenameof', 'as', 'from'],
        builtintypes: [
            'u8',
            'u16',
            'u24',
            'u32',
            'u48',
            'u64',
            'u96',
            'u128',
            's8',
            's16',
            's24',
            's32',
            's48',
            's64',
            's96',
            's128',
            'float',
            'double',
            'char',
            'char16',
            'bool',
            'padding',
            'str',
            'auto',
        ],
        symbols: /[=><!~&|+\-*/^%]+/,
        escapes: /\\(p|r|c|n|l|f|t|v|a|b|e|\\|"|'|\d+|x[0-9a-fA-F]{2})/,
        charEscapes: /\\(r|c|n|l|f|t|v|a|b|e|\\|"|'|x[0-9a-fA-F]{2})/,

        hexNumber: /0(x|X)[0-9a-fA-F]('?[0-9a-fA-F])*/,
        decNumber: /\d('?\d)*/,
        octNumber: /0o[0-7]('?[0-7])*/,
        binNumber: /0(b|B)[0-1]('?[0-1])*/,
        exponent: /(e|E)(\+|-)?\d('?\d)*/,
        brackets: [
            {open: '{', close: '}', token: 'delimiter.curly'},
            {open: '[', close: ']', token: 'delimiter.square'},
            {open: '(', close: ')', token: 'delimiter.parenthesis'},
            {open: '<', close: '>', token: 'delimiter.angle'},
        ],

        // The main tokenizer for our languages
        tokenizer: {
            root: [
                [
                    /[A-Za-z]([_]?\w)*/,
                    {
                        cases: {
                            '@builtintypes': 'type',
                            '@keywords': 'keyword',
                            '@wordOperators': 'keyword',
                            '@default': 'identifier',
                        },
                    },
                ],
                {include: '@whitespace'},
                [/([:|[[{(]\.|\.[\]})]|[[\]{}()])/, '@brackets'],
                [
                    /@symbols/,
                    {
                        cases: {
                            '@operators': 'operator',
                            '@default': '',
                        },
                    },
                ],

                // number literals
                // floats
                [/@decNumber(\.@decNumber(@exponent)|@exponent)(')?(f|F|d|D)(32|64)?/, 'number.float'],
                [/(@decNumber|@octNumber|@binNumber)(')?(f|F|d|D)(32|64)?/, 'number.float'],
                [/@hexNumber'(f|F|d|D)(32|64)?/, 'number.float'],

                // ints
                [/@hexNumber(')?((i|I|u|U)(8|16|32|64))?/, 'number.hex'],
                [/@octNumber(')?((i|I|u|U)(8|16|32|64))?/, 'number.octal'],
                [/@binNumber(')?((i|I|u|U)(8|16|32|64))?/, 'number.binary'],

                [/@decNumber(')?((i|I|u|U)(8|16|32|64))?/, 'number'],

                [/(")(.*)(")/, ['string', 'string', 'string']],
                [/(')(.*)(')/, ['char', 'string', 'string']],
                [/^\s*#\s*\w+/, 'keyword.directive'],
            ],
            whitespace: [[/[ \t\r\n]+/, 'white']],
            comment: [
                [/[^/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'], // nested comment
                ['\\*/', 'comment', '@pop'],
                [/[/*]/, 'comment'],
            ],
        },
    };
}

monaco.languages.register({id: 'pl'});
monaco.languages.setMonarchTokensProvider('pl', definition());

export {};
