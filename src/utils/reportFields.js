import { resolveImage } from './blogFields.js'

export function normalizeReport(report) {
  return {
    _id: report?._id,
    title: report?.reportTitle || report?.title || '',
    category: report?.category || '',
    date: report?.reportDate || report?.date || report?.createdAt || '',
    description: report?.description || '',
    coverImage: resolveImage(
      report?.coverImageLink || report?.coverImage || ''
    ),
    fileLink: report?.reportFileLink || report?.fileLink || '',
    downloadName: report?.downloadFileName || '',
  }
}
