# @larrym/file-saver

A modern, lightweight file-saver library with full ESM support for downloading files in the browser.

## Features

- ✨ Full ESM (ES Modules) support
- 📦 CommonJS compatible
- 🔷 TypeScript support with full type definitions
- 🌐 Browser-based file downloads
- 🎯 Multiple file format support (Text, JSON, CSV, Blob)
- 📥 URL-based file downloads
- 🔒 Zero dependencies
- 🪶 Lightweight

## Installation

```bash
npm install @larrym/file-saver
```

## Usage

### ESM (Recommended)

```typescript
import { saveAs, saveText, saveJSON, saveCSV, downloadURL } from '@larrym/file-saver';

// Save a blob
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
saveAs(blob, 'hello.txt');

// Save text
saveText('Hello, World!', 'hello.txt');

// Save JSON
const data = { name: 'John', age: 30 };
saveJSON(data, 'data.json', true); // true = pretty print

// Save CSV
const csvData = [
  ['Name', 'Age'],
  ['John', '30'],
  ['Jane', '25']
];
saveCSV(csvData, 'data.csv');

// Download from URL
await downloadURL('https://example.com/file.pdf', 'document.pdf');
```

### CommonJS

```javascript
const { saveAs, saveText, saveJSON } = require('@larrym/file-saver');

saveText('Hello, World!', 'hello.txt');
```

### Default Import

```typescript
import fileSaver from '@larrym/file-saver';

fileSaver.saveText('Hello, World!', 'hello.txt');
```

## API Reference

### `saveAs(data, fileName, options?)`

Save any data as a file.

- **data**: `Blob | string | ArrayBuffer` - The data to save
- **fileName**: `string` - The name of the file
- **options**: `SaveOptions` (optional)
  - `autoBom`: `boolean` - Automatically add BOM for text files (default: `true`)

```typescript
const blob = new Blob(['data'], { type: 'text/plain' });
saveAs(blob, 'file.txt');
```

### `saveText(text, fileName)`

Save text content as a file.

- **text**: `string` - The text content
- **fileName**: `string` - The name of the file

```typescript
saveText('Hello, World!', 'hello.txt');
```

### `saveJSON(data, fileName, pretty?)`

Save JSON data as a file.

- **data**: `unknown` - The data to save as JSON
- **fileName**: `string` - The name of the file
- **pretty**: `boolean` - Format with indentation (default: `true`)

```typescript
const data = { message: 'Hello' };
saveJSON(data, 'data.json', true);
```

### `saveCSV(csvData, fileName)`

Save CSV data as a file.

- **csvData**: `string | string[][]` - CSV string or array of arrays
- **fileName**: `string` - The name of the file

```typescript
const data = [
  ['Name', 'Email'],
  ['John', 'john@example.com']
];
saveCSV(data, 'contacts.csv');
```

### `downloadURL(url, fileName)`

Download a file from a URL.

- **url**: `string` - The URL to download from
- **fileName**: `string` - The name to save the file as
- **Returns**: `Promise<void>`

```typescript
await downloadURL('https://example.com/image.jpg', 'photo.jpg');
```

## Browser Compatibility

This library works in all modern browsers that support:
- Blob API
- URL.createObjectURL
- HTML5 download attribute

## TypeScript

Full TypeScript support is included with type definitions.

```typescript
import { saveAs, SaveOptions } from '@larrym/file-saver';

const options: SaveOptions = {
  autoBom: true
};

const blob = new Blob(['data']);
saveAs(blob, 'file.txt', options);
```

## Publishing

This package uses npm's trusted publishing feature with OIDC authentication for secure, token-free publishing from GitHub Actions.

### Setting Up Trusted Publishing on npm

1. **Create or login to your npm account** at https://www.npmjs.com

2. **Navigate to package settings**:
   - Go to your package page (or create a new scoped package placeholder)
   - Click on "Settings" tab
   - Scroll to "Publishing access" section

3. **Add trusted publisher**:
   - Click "Add trusted publisher"
   - Select "GitHub Actions"
   - Fill in the details:
     - **Organization/Username**: `larrymotalavigne`
     - **Repository**: `file-saver`
     - **Workflow filename**: `publish.yml`
     - **Environment name**: `npm-publish`

4. **Save the configuration**

### Publishing a Release

1. Create a new release on GitHub:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Go to GitHub → Releases → Create a new release

3. The GitHub Action will automatically publish to npm using OIDC authentication

### Manual Publishing (for testing)

You can also trigger the workflow manually from the Actions tab in GitHub.

### Requirements

- Node.js >= 18.0.0
- npm >= 11.5.1 (for OIDC trusted publishing)

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# The build outputs to dist/ folder with:
# - dist/index.js (ESM)
# - dist/index.cjs (CommonJS)
# - dist/index.d.ts (TypeScript types for ESM)
# - dist/index.d.cts (TypeScript types for CommonJS)
```

## License

MIT © Larry Motalavigne

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security

This package uses npm's trusted publishing with OIDC, which provides:
- No long-lived tokens to manage or leak
- Cryptographic verification of publisher identity
- Automatic provenance attestations
- Enhanced supply chain security

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/larrymotalavigne/file-saver/issues).
