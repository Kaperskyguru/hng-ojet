let platform="undefined"!=typeof window?window.location.host:"127.0.0.1",settings={};settings.api_url=platform.match(/(127.0.0.1|localhost)/)?"http://localhost:3000/":"http://api.start.ng/";export default settings;