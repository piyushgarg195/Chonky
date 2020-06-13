import React, { useCallback } from 'react';
import c from 'classnames';
import { FileArray } from 'chonky';
import { Nullable } from 'tsdef';

import { FileEntry, FileEntryProps } from '../internal/FileEntry';

export interface EntrySize {
    width: number;
    height: number;
}

export const SmallThumbsSize: EntrySize = { width: 200, height: 160 };

export const getColWidth = (
    index: number,
    columnCount: number,
    entrySize: EntrySize,
    gutterSize: number
) => {
    if (index === columnCount - 1) return entrySize.width;
    return entrySize.width + gutterSize;
};

export const getRowHeight = (
    index: number,
    rowCount: number,
    entrySize: EntrySize,
    gutterSize: number
) => {
    if (index === rowCount - 1) return entrySize.height;
    return entrySize.height + gutterSize;
};

export const useEntryRenderer = (files: Nullable<FileArray>) => {
    // All hook parameters should go into `deps` array
    const deps = [files];
    const entryRenderer = useCallback(
        (
            virtualKey: string,
            index: number,
            style: any,
            parent: any,
            gutterSize?: number,
            lastRow?: boolean,
            lastColumn?: boolean
        ) => {
            // This check is required to meet the hooks requirements (no conditional
            // hooks) and context requirements (context can sometimes be null) in the
            // parent component, `FileList`. During normal execution, `files` will never
            // be null.
            if (!files) return <p>123</p>;

            if (typeof gutterSize === 'number') {
                if (lastRow !== true) style.height = style.height - gutterSize;
                if (lastColumn !== true) style.width = style.width - gutterSize;
            }

            if (index >= files.length) return null;
            const file = files[index];
            const key = file ? file.id : `loading-file-${virtualKey}`;
            const entryProps: FileEntryProps = {
                file,
                style,
            };

            return <FileEntry key={key} {...entryProps} />;
        },
        [deps]
    );

    return entryRenderer;
};

export const noContentRenderer = (height?: number) => {
    const placeholderProps: any = {
        className: c({
            'chonky-file-list-notification': true,
            'chonky-file-list-notification-empty': true,
        }),
    };
    if (typeof height === 'number') placeholderProps.style = { height };

    return (
        <div {...placeholderProps}>
            <div className="chonky-file-list-notification-content">
                {/* TODO: <Icon icon={icons.folderOpen} />*/}
                &nbsp; Nothing to show
            </div>
        </div>
    );
};