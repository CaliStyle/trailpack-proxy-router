const fs = require('fs')
const path = require('path')
const Remarkable = require('remarkable')
const components = require('../../../lib/remarkable/components')
const assert = require('assert')

function fixture(name) {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')
}
describe('Remarkable Components', () => {
  it('should parse html components', function () {
    const mdText = fixture('../../../../content/components/series/a0/0.0.0.md')
    const md = new Remarkable()
    md.use(components)
    const html = md.render(mdText)
    const expectedHtml = [
      '<hello></hello>',
      '<hello-world></hello-world>',
      '<hello-earth>My Name is Scott</hello-earth>',
      '<hello-mars [awesome]="yes"></hello-mars>'
    ].join('\n')

    assert(expectedHtml, html)

  })
})
