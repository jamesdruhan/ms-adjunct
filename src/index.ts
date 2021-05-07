export default class VueMSGraph
{
    static install ( vue : any, options : any ) : void
    {
        vue.prototype.$vueMSGraph = new stuff (options) {};
    }
}