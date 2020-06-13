import React from 'react';

import 'chonky/style/main.css';
import { FileBrowser, FileList, FileToolbar, FileAction, FileActionData } from 'chonky';

import { createDocsObject, showNotification } from '../story-helpers';

// @ts-ignore
// eslint-disable-next-line
import markdown from './04-Actions.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|Using file actions',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const ActionsExample = () => {
    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showNotification({ text: `You just triggered an action: ${action.name}` });
    };

    const folderChain = [
        { id: 'gBt4z3', name: 'My Documents', isDir: true },
        { id: 'gM5tTe', name: 'Classwork', isDir: true },
    ];
    const files = [
        { id: 'mHe4A1', name: 'Meaning of life.txt', size: 31415 },
        { id: 'yt43Ax', name: 'SCP-3930 Photos', isDir: true },
    ];

    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                onFileAction={handleFileAction}
            >
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};