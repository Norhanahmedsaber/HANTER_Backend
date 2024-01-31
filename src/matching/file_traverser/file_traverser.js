import fs from 'fs'
import path from 'path'
import { Minimatch, minimatch } from 'minimatch'

export default function getFiles(dirPath, { extensions, ignoredDirs, ignoredPatterns }) {

  // get the absolute path for the passed relative path 
  const dirAbsolutePath = getAbsolutePath(dirPath)
  // check if the directory does not exist 
  if(!fs.existsSync(dirAbsolutePath)) {
      return []
  }
  
  // get files/dirs names 
  const files = fs.readdirSync(dirAbsolutePath)
  let filePaths = []

  // Adding the full path to each file/dir name
  for (let file in files){

    // Checks if the file/dir is a directory
    if(fs.statSync(path.join(dirAbsolutePath, files[file])).isDirectory()) {
      // Traverses the directoy in a recursive manner
      if(ignoredDirs.includes(path.basename(files[file]))) {
        continue;
      }
      filePaths = filePaths.concat(getFiles(path.join(dirPath, files[file]), { extensions, ignoredDirs }))
    }else { // Not a directory
      const isValidExtension = extensions.includes(getExtension(files[file]))
      const isIgnoredPattern = isIgnored(path.join(dirPath, files[file]), ignoredPatterns)
      if (isValidExtension && !isIgnoredPattern) {
        filePaths.push(path.join(dirPath, files[file]))
      }
    } 
      
  }
  return filePaths         
}

const getAbsolutePath = (dirPath) => path.resolve(path.dirname('./'), dirPath)
const getExtension = (file) => file.split('.').pop()
const isIgnored = (file, ignoredPatterns) => {
  for(let pattern in ignoredPatterns) {
    if(matchPattern(file, ignoredPatterns[pattern])) {
      return true
    }
  }
  return false
}
const matchPattern = (file, pattern) => {
  return minimatch(file, pattern) 
}
