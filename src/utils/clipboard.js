import Vue from 'vue'
import Clipboard from 'clipboard'
import {
    Notification
} from 'element-ui'

function clipboardSuccess() {
    Notification({
        message: '复制成功',
        type: 'success',
        duration: 1500,
        offset: 50
    })
}

function clipboardError() {
    Notification({
        message: '复制失败',
        type: 'error',
        offset: 50
    })
}

export default function handleClipboard(text, event) {
    const clipboard = new Clipboard(event.target, {
        text: () => text
    })
    clipboard.on('success', () => {
        clipboardSuccess()
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        clipboardError()
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
    })
    clipboard.onClick(event)
}