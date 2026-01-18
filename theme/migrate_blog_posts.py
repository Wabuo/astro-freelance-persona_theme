import os
import re
import yaml

# Path to blog posts
BLOG_POSTS_DIR = "/home/fabio/Documents/Programming/Website/Astro/astro_freelance-persona_theme/theme/starter/src/content/blog_posts"

# Comment block to add
LICENSE_COMMENT = """# img_license: Auto-links known licenses (CC0, CC BY, etc.) defined in licenseUtils.ts.
# To override/custom link, use object format: { name: "Custom", url: "..." }"""

def migrate_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Split frontmatter
    # Assuming standard --- separators
    parts = re.split(r'^---$', content, maxsplit=2, flags=re.MULTILINE)
    
    if len(parts) < 3:
        print(f"Skipping {filepath}: Invalid format")
        return

    frontmatter_raw = parts[1]
    body = parts[2]

    # Simple parsing to find img_credit and img_license lines to replace them safely
    # We don't use full YAML parser to preserve comments/order if possible, but structure might change.
    # Actually, full YAML parser is safer for structure, but destroys comments.
    # Given these are simple files, let's do regex substitution.

    # 1. Convert img_credit: "Value" -> img_credit:\n  name: "Value"
    # Capture the value. 
    # Regex: img_credit:\s*"?([^"\n]+)"?
    
    new_frontmatter = frontmatter_raw

    # Check if img_credit is already an object (multiline)
    if "img_credit:" in new_frontmatter:
        # Check if it's a simple string line
        match = re.search(r'img_credit:\s*"?([^"\n]+)"?', new_frontmatter)
        if match:
            original_value = match.group(1).strip()
            # If it's already an object (starts with formatting or new lines), we might miss it with this regex if not careful.
            # But the current files seem to be `img_credit: "Gemini"`
            
            # Skip if it looks like a key start (e.g. valid yaml object start?)
            # If the value is "Gemini", we proceed.
            if not original_value.startswith("\n"):
                replacement = f'img_credit: \n  name: "{original_value}"'
                new_frontmatter = new_frontmatter.replace(match.group(0), replacement)

    # 2. Add comment before img_license
    if "img_license:" in new_frontmatter:
        # Check if comment already exists
        if "# img_license: Auto-links" not in new_frontmatter:
            new_frontmatter = new_frontmatter.replace("img_license:", f"{LICENSE_COMMENT}\nimg_license:")

    # Reassemble
    new_content = f"---{new_frontmatter}---{body}"
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

def main():
    if not os.path.exists(BLOG_POSTS_DIR):
        print(f"Directory not found: {BLOG_POSTS_DIR}")
        return

    for filename in os.listdir(BLOG_POSTS_DIR):
        if filename.endswith(".md"):
            migrate_file(os.path.join(BLOG_POSTS_DIR, filename))

if __name__ == "__main__":
    main()
