css_content = r'''BODY_PLACEHOLDER
*{margin:0;padding:0;box-sizing:border-box;scroll-behavior:smooth}
NAV_PLACEHOLDER
'''.replace('BODY_PLACEHOLDER', '')
# just checking we can write
with open(r'C:\Users\Antinomy\Documents\New project\css\style.css', 'w', encoding='utf-8') as f:
    f.write('/* test */')
print('ok')
