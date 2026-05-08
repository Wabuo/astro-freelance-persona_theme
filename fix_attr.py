import os

attr_path = 'theme/src/freelance-persona/styles/_attribution.scss'
with open(attr_path, 'r') as f:
    content = f.read()

if '@mixin styles()' not in content:
    lines = content.split('\n')
    new_content = '@mixin styles() {\n'
    for line in lines:
        new_content += ('  ' + line if line else '') + '\n'
    new_content += '}\n'
    with open(attr_path, 'w') as f:
        f.write(new_content)

files = [
    'theme/src/freelance-persona/styles/hero.scss',
    'theme/src/freelance-persona/styles/blog-post.scss',
    'theme/src/freelance-persona/styles/_filtered-posts.scss',
    'theme/src/freelance-persona/styles/_blog-categories.scss',
    'theme/src/freelance-persona/styles/_about.scss'
]

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    if '@include attribution.styles()' not in content:
        # We need to insert @include attribution.styles(); inside the relevant block.
        # It's safest to just replace the '--attribution-font-size' line with itself + the include,
        # but only the FIRST occurrence if it's not already there.
        # Alternatively, we can use regex to find where attribution is scoped.
        pass

