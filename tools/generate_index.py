#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
笔记索引生成器
扫描各个子项目的 markdown/ 文件夹，生成 notes.json 索引文件。

用法:
    python tools/generate_index.py

然后刷新网页即可看到新增的笔记。
"""

import os
import json
import re
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS = ['algorithm', 'hadoop', 'blog']


def extract_title(content, filename):
    """从 Markdown 内容中提取第一个 # 标题"""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return os.path.splitext(filename)[0]


def extract_description(content):
    """提取第一个非空、非标题段落作为简介"""
    for line in content.split('\n'):
        stripped = line.strip()
        if not stripped or stripped.startswith('#'):
            continue
        text = re.sub(r'[#*_\`\[\]()>|~\-\+]', '', stripped).strip()
        if text:
            return (text[:150] + '...') if len(text) > 150 else text
    return ''


def generate_index():
    print('=' * 50)
    print('  笔记索引生成器')
    print('=' * 50)

    for project in PROJECTS:
        md_dir = os.path.join(BASE_DIR, project, 'markdown')
        notes = []

        if not os.path.isdir(md_dir):
            print('  [WARN] %s/markdown/ 不存在，跳过' % project)
            continue

        files = sorted([f for f in os.listdir(md_dir) if f.endswith('.md')])
        print('  [SCAN] %s/markdown/ (%d 个文件)' % (project, len(files)))

        for fname in files:
            fpath = os.path.join(md_dir, fname)
            try:
                # utf-8-sig 自动去除 BOM（如果存在）
                with open(fpath, 'r', encoding='utf-8-sig') as f:
                    content = f.read()
            except Exception as e:
                print('  [WARN] 读取 %s 失败: %s' % (fname, e))
                continue

            mtime = datetime.fromtimestamp(
                os.path.getmtime(fpath)
            ).strftime('%Y-%m-%d %H:%M')

            note = {
                'file': fname,
                'title': extract_title(content, fname),
                'description': extract_description(content),
                'date': mtime,
            }
            notes.append(note)
            print('    [OK] %s' % note['title'])

        outpath = os.path.join(BASE_DIR, project, 'notes.json')
        with open(outpath, 'w', encoding='utf-8') as f:
            json.dump(notes, f, ensure_ascii=False, indent=2)
        print('  [DONE] %s/notes.json (%d 篇)' % (project, len(notes)))

    print('=' * 50)
    print('  完成！刷新页面即可查看更新。')
    print('  添加新的 .md 到 markdown/ 后重新运行此脚本即可。')
    print('=' * 50)


if __name__ == '__main__':
    generate_index()
