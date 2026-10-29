const fs = require('fs');
const file = 'archiranine_repo/admin/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace brand name
content = content.replace(/Archirani/g, 'ArchiRanin');
content = content.replace(/ARCHIRANI/g, 'ARCHIRANIN');
content = content.replace(/admin@archirani\.local/g, 'sahnounranine8@gmail.com');
content = content.replace(/contact@archirani\.local/g, 'sahnounranine8@gmail.com');

// Add videoUrl to initial state
content = content.replace(
  'location: "",\n      status: "draft",',
  'location: "",\n      videoUrl: "",\n      status: "draft",'
);

// Add videoUrl input in ProjectForm after location
const locationInput = `<label>
              Lieu
              <input
                name="location"
                value={form.location || ""}
                onChange={change}
              />
            </label>`;

const videoInput = `<label>
              Lieu
              <input
                name="location"
                value={form.location || ""}
                onChange={change}
              />
            </label>
            <label className="wide">
              Lien Vidéo / Visite Virtuelle (YouTube, Vimeo ou URL direct .mp4)
              <input
                name="videoUrl"
                value={form.videoUrl || ""}
                onChange={change}
                placeholder="https://..."
              />
            </label>`;

content = content.replace(locationInput, videoInput);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated admin/src/App.jsx');
