
class PRRoot {
    constructor(rootInstance, selector) {
        this.root = rootInstance;
        this.dom = $(selector);
        let id = rootInstance.components.length
        this.dom.addClass(`pr-comp-${id}`);
        this.dom.attr('data-pr-comp-id', id);
        this.id = id;
        this.children = this.dom.children();
        this.state = {};
        this.dom[0].prComp = this;
        this.stateBehaviorOverrides = {};
        this.routes = {};
        this.templates = {};


        // Register Events
        this.dom[0].onclick = (e) => this.click(e);
    }

    prepareStates() {
        // Replace ${state}
        let html = this.dom.html().split('${{');
        let newHtml = '';
        html.map((item, i) => {
            let dec = item.split('}}');
            let identifier = dec[0];
            if (identifier !== item) {
                let state = this.state[identifier];
                let val = state;
                console.log(state);
                if (this.stateBehaviorOverrides.hasOwnProperty(identifier)) {
                    // Overridden Behaviour
                    val = this.stateBehaviorOverrides[identifier](state);
                } else if (Array.isArray(state)) {

                    let html = '';
                    state.map((item, i) => {
                        html += `<div class="${identifier}-item" data-pr-id="${i}">${item}</div>`
                    });
                    val = html;
                }
                dec[0] = `<span class="pr-state" data-pr-identifier="${identifier}">${val}</span>`;
                html[i] = dec.join('');
            }
        });
        newHtml = html.join('');
        this.dom.html(newHtml);

        this.refreshInputs();
        this.refreshStyles();
        this.refreshClasses();
        this.refreshAttributes();
        this.refreshSrc();
        this.registerRoutes();
    }

    registerRoutes() {
        let links = $('.pr-link');
        let linksObj = {};
        links.toArray().map((item, i) => {
            linksObj[item.getAttribute('data-pr-href').slice(1)] = $(item);
        });
        links.click((e) => {
            let href = e.target.getAttribute('data-pr-href');
            if (href.indexOf('http') !== -1) {
                let win = window.open('', '_blank')
                win.location.href = href;
            } else {
                location.hash = href;
                this.loadRoute();
            }
        });

        let routes = $('.pr-route');
        routes.hide();
        routes.toArray().map((item, i) => {
            let identifier = item.getAttribute('data-pr-route').slice(1)
            let link = linksObj[identifier];
            this.routes[identifier] = {
                route: $(item),
                link: link
            };
        });
        this.loadRoute();
    }

    loadRoute() {
        $('.pr-route').hide();
        $('.pr-link').removeClass('pr-link-active');
        this.routes[location.hash.slice(2)].link.addClass('pr-link-active');
        this.routes[location.hash.slice(2)].route.fadeIn(750);
    }

    setState(state) {
        Object.entries(state).map((item, i) => {
            this.state[item[0]] = item[1];
        });
        this.refresh();
    }

    refresh() {
        let domStates = $('.pr-state');
        domStates.toArray().map((item, i) => {
            let it = $(item);
            let identifier = it.attr('data-pr-identifier');
            let state = this.state[identifier];
            let val = state;
            if (this.stateBehaviorOverrides.hasOwnProperty(identifier)) {
                // Overridden Behaviour
                val = this.stateBehaviorOverrides[identifier](state);
            } else if (Array.isArray(state)) {
                let html = '';
                state.map((item, i) => {
                    html += `<div class="${identifier}-item" data-pr-id="${i}">${item}</div>`
                });
                val = html;
            }
            it.html(val);
        });

        this.refreshInputs();
        this.refreshStyles();
        this.refreshClasses();
        this.refreshAttributes();
        this.refreshSrc();
    }

    refreshInputs() {
        let inputs = $('.pr-value');
        inputs.toArray().map((item, i) => {
            let identifier = $(item).attr('data-pr-value-state');
            let state = this.state[identifier]
            let val = state;
            if (this.stateBehaviorOverrides.hasOwnProperty(identifier)) {
                val = this.stateBehaviorOverrides[identifier](state);
            }
            item.value = val;
        });
    }

    refreshClasses() {
        let classes = $('.pr-class');
        classes.toArray().map((item, i) => {
            let identifier = $(item).attr('data-pr-class-state');
            let state = this.state[identifier]
            let val = state;
            if (this.stateBehaviorOverrides.hasOwnProperty(identifier)) {
                val = this.stateBehaviorOverrides[identifier](state);
            }
            item.classList = [];
            val.push('pr-class');
            $(item).addClass(val);
        });
    }

    refreshSrc() {
        let srcs = $('.pr-src');
        srcs.toArray().map((item, i) => {
            let identifier = $(item).attr('data-pr-src-state');
            let state = this.state[identifier]
            let val = state;
            if (this.stateBehaviorOverrides.hasOwnProperty(identifier)) {
                val = this.stateBehaviorOverrides[identifier](state);
            }
            item.src = val;
        });
    }

    refreshAttributes() {
        let attrs = $('.pr-attr');
        attrs.toArray().map((item, i) => {
            let targets = JSON.parse($(item).attr('data-pr-attr-states'));
            Object.keys(targets).map(key => {
                let identifier = targets[key];
                let state = this.state[identifier]
                let val = state;
                if (this.stateBehaviorOverrides.hasOwnProperty(identifier)) {
                    val = this.stateBehaviorOverrides[identifier](state);
                }
                $(item).attr(key, val);
            });
        });
    }

    refreshStyles() {
        let styles = $('.pr-style');
        styles.toArray().map((item, i) => {
            let identifier = $(item).attr('data-pr-style-state');
            let state = this.state[identifier]
            let val = state;
            if (this.stateBehaviorOverrides.hasOwnProperty(identifier)) {
                val = this.stateBehaviorOverrides[identifier](state);
            }
            $(item).css(val);
        });
    }

    printState() {
        console.table(this.state);
    }

    // Events
    click() {}
}

class PhotonReact {
    constructor(state = {}) {
        this.components = [];
        window.prState = state;
    }

    setState(state) {
        Object.entries(state).map((item, i) => {
            window.state[item[0]] = item[1];
        });
    }

    getState(id) {
        return window.state[id];
    }

    addComponent(selector) {
        this.components.push(new PRComp(this, selector, this.components.length));
    }
}

$(document).ready(() => {

});

//export { PhotonReact, PRComp };