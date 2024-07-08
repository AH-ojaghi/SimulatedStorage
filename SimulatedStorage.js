// Functional simulated external storage system with extended features

// Define initial storage structure
let fileSystem = {
  "/": {
    type: "directory",
    children: {
      "example.txt": {
        type: "file",
        content: "This is some content.",
        versions: [{ content: "This is some content.", timestamp: new Date() }],
        permissions: { read: true, write: true, execute: false },
      },
      "myFolder": {
        type: "directory",
        children: {},
        permissions: { read: true, write: true, execute: true },
      },
    },
    permissions: { read: true, write: true, execute: true },
  },
};

// Function to create a file in a specified directory
function createFile(parentPath, fileName, content = "") {
  let parent = navigateToPath(parentPath);
  if (!parent || parent.type !== "directory") {
    console.log("Error: Parent directory not found.");
    return;
  }

  if (parent.children[fileName]) {
    console.log(`Error: File '${fileName}' already exists.`);
    return;
  }

  parent.children[fileName] = {
    type: "file",
    content: content,
    versions: [{ content: content, timestamp: new Date() }],
    permissions: { read: true, write: true, execute: false },
  };
}

// Function to create a directory in a specified parent directory
function createDirectory(parentPath, directoryName) {
  let parent = navigateToPath(parentPath);
  if (!parent || parent.type !== "directory") {
    console.log("Error: Parent directory not found.");
    return;
  }

  if (parent.children[directoryName]) {
    console.log(`Error: Directory '${directoryName}' already exists.`);
    return;
  }

  parent.children[directoryName] = {
    type: "directory",
    children: {},
    permissions: { read: true, write: true, execute: true },
  };
}

// Function to delete a file or directory
function deleteFileOrDirectory(parentPath, name) {
  let parent = navigateToPath(parentPath);
  if (!parent || parent.type !== "directory") {
    console.log("Error: Parent directory not found.");
    return;
  }

  if (!parent.children[name]) {
    console.log(`Error: '${name}' does not exist.`);
    return;
  }

  delete parent.children[name];
}

// Function to read the content of a file
function readFile(filePath) {
  let file = navigateToPath(filePath);
  if (file && file.type === "file") {
    return file.content;
  } else {
    console.log("Error: File not found or is not a file.");
    return null;
  }
}

// Function to write content to a file
function writeFile(filePath, content) {
  let file = navigateToPath(filePath);
  if (file && file.type === "file") {
    // Save current content as a new version
    file.versions.push({ content: file.content, timestamp: new Date() });

    // Update content to new content
    file.content = content;

    console.log(`File '${filePath}' updated.`);
  } else {
    console.log("Error: File not found or is not a file.");
  }
}

// Function to list contents of a directory
function listDirectoryContents(directoryPath) {
  let directory = navigateToPath(directoryPath);
  if (directory && directory.type === "directory") {
    return Object.keys(directory.children);
  } else {
    console.log("Error: Directory not found or is not a directory.");
    return null;
  }
}

// Function to navigate to a path and return the object at that path
function navigateToPath(path) {
  let current = fileSystem["/"];
  let parts = path.split("/").filter((part) => part !== "");

  for (let part of parts) {
    if (current.children && current.children[part]) {
      current = current.children[part];
    } else {
      return null;
    }
  }

  return current;
}

// Example usage
createFile("/", "example.txt", "This is some content.");
console.log(readFile("/example.txt")); // Output: This is some content.

writeFile("/example.txt", "Updated content.");
console.log(readFile("/example.txt")); // Output: Updated content.

createDirectory("/", "myFolder");
console.log(listDirectoryContents("/")); // Output: ['example.txt', 'myFolder']

deleteFileOrDirectory("/", "example.txt");
console.log(listDirectoryContents("/")); // Output: ['myFolder']
