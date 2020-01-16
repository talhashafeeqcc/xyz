const template = require('backtick-template');

const nanoid = require('nanoid');

const fetch = require('node-fetch');

module.exports = (req, res) => {

    // const md = new Md(req.headers['user-agent']);

    // const platform = (md.mobile() === null || md.tablet() !== null) ? 'desktop' : 'mobile';

    // const partials = {
    //     header: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/header.html`), 'utf8'),
    //     services: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/services.html`), 'utf8'),
    //     case_studies: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/case_studies.html`), 'utf8'),
    //     team: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/team.html`), 'utf8'),
    //     geodata: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/geodata.html`), 'utf8'),
    //     mapp: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/mapp.html`), 'utf8'),
    //     contact: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/contact.html`), 'utf8'),
    //     awards: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/awards.html`), 'utf8'),
    //     footer: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/footer.html`), 'utf8'),
    // }

    // const html = template(
    //     fs.readFileSync(path.join(process.cwd(), `public/html/${platform}.html`), 'utf8'),
    //     {
    //         ...partials
    //     });

    res.send('root');
}