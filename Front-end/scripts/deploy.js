/* Script Copyrights: https://www.johnlouros.com/blog/uploading-a-angular-app-to-S3-with-npm */

/* Install AWS tools
// https://docs.aws.amazon.com/powershell/latest/userguide/pstools-getting-set-up.html
*/

/* Install AWS-CLI (optional)
// https://docs.aws.amazon.com/cli/latest/userguide/installing.htm
*/

/* Find credentials and set up
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
*/

/* Note for Windows:
// 1. Windows Explorer won't allow you to name a folder begin with a dot.
//    You might need Windows Powershell or cmd to mkdir.
// 2. No file extenstion for credentials
// 3. Remember to add AWS-CLI into the environment variables 
*/

const AWS = require("aws-sdk"); // imports AWS SDK
const mime = require('mime-types') // mime type resolver
const fs = require("fs"); // utility from node.js to interact with the file system
const path = require("path"); // utility from node.js to manage file/folder paths

// configuration necessary for this script to run
const config = {
    s3BucketName: 'drink-rank-dev',
    folderPath: '../dist' // path relative script's location
  };

// initialise S3 client
const s3 = new AWS.S3({
    signatureVersion: 'v4',
});

// resolve full folder path
const distFolderPath = path.join(__dirname, config.folderPath);

// Normalize \\ paths to / paths.
function unixifyPath(filepath) {
    return process.platform === 'win32' ? filepath.replace(/\\/g, '/') : filepath;
};

// Recurse into a directory, executing callback for each file.
function walk(rootdir, callback, subdir) {
    // is sub-directory
    const isSubdir = subdir ? true : false;
    // absolute path
    const abspath = subdir ? path.join(rootdir, subdir) : rootdir;

    // read all files in the current directory
    fs.readdirSync(abspath).forEach((filename) => {
        // full file path
        const filepath = path.join(abspath, filename);
        // check if current path is a directory
        if (fs.statSync(filepath).isDirectory()) {
            walk(rootdir, callback, unixifyPath(path.join(subdir || '', filename || '')))
        } else {
            fs.readFile(filepath, (error, fileContent) => {
                // if unable to read file contents, throw exception
                if (error) {
                    throw error;
                }

                // map the current file with the respective MIME type
                const mimeType = mime.lookup(filepath);
                
                // build S3 PUT object request
                const s3Obj = {
                    // set appropriate S3 Bucket path
                    Bucket: isSubdir ? `${config.s3BucketName}/${subdir}` : config.s3BucketName,
                    Key: filename,
                    Body: fileContent,
                    ContentType: mimeType
                }

                // upload file to S3
                s3.putObject(s3Obj, (err, data) => {
                    if (err)
                        console.log(err.message);
                    else                        
                        console.log(`Successfully uploaded '${filepath}' with MIME type '${mimeType}'`);
                })
            })
        }
    })
}

// start upload process
walk(distFolderPath, (filepath, rootdir, subdir, filename) => {
    console.log('Filepath', filepath);
});