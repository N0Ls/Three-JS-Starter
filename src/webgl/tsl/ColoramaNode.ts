import { Color, TempNode } from "three/webgpu";
import { nodeObject, Fn, uniform, vec3, min, max, float, mix, select, If } from "three/tsl";

/**
 * Post processing node for creating colorama effect.
 *
 * @augments TempNode
 *
 */
class ColoramaNode extends TempNode {

    static get type() {

        return "ColormaNode";

    }

    /**
     * Constructs a new dot screen node.
     *
     * @param {Node} inputNode - The node that represents the input of the effect.
     * @param {Color} [color1=Color(1, 1, 0)] - The color of the effect.
     * @param {Color} [color2=Color(0, 1, 0)] - The second color of the effect.
     */
    constructor(inputNode, color1 = new Color(1, 1, 0), color2 = new Color(0, 1, 0)) {

        super("vec4");

        /**
         * The node that represents the input of the effect.
         *
         * @type {Node}
         */
        this.inputNode = inputNode;

        /**
         * A uniform node that represents the first color of the effect.
         *
         * @type {UniformNode<vec3>}
         */
        this.color1 = uniform(color1);

        /**
         * A uniform node that represents the second color of the effect.
         *
         * @type {UniformNode<vec3>}
         */
        this.color2 = uniform(color2);

    }

    /**
     * This method is used to setup the effect's TSL code.
     *
     * @param {NodeBuilder} builder - The current node builder.
     * @return {ShaderCallNodeInternal}
     */
    setup() {

        const inputNode = this.inputNode;

        const remap = Fn(([value, destMin, destMax, sourceMin, sourceMax]) => {
            return destMin.add(value.sub(sourceMin).div(sourceMax.sub(sourceMin)).mul(destMax.sub(destMin)));
        });

        const hsl2rgb = Fn(([c]) => {
            const r = float(0.0).toVar();
            const g = float(0.0).toVar();
            const b = float(0.0).toVar();

            If(c.y.equal(float(0)), () => {
                r.assign(c.z);
                g.assign(c.z);
                b.assign(c.z);
            })
                .Else(() => {
                    const q = select(c.z.lessThan(float(0.5)),
                        c.z.mul(float(1).add(c.y)),
                        c.z.add(c.y).sub(c.z.mul(c.y)));
                    const p = float(2).mul(c.z).sub(q);

                    r.assign(hue2rgb(p, q, c.x.add(float(1).div(float(3)))));
                    g.assign(hue2rgb(p, q, c.x));
                    b.assign(hue2rgb(p, q, c.x.sub(float(1).div(float(3)))));
                });

            return vec3(r, g, b);
        });

        const hue2rgb = Fn(([p, q, t]) => {
            const tVar = t.toVar();
            const qVar = q.toVar();
            const pVar = p.toVar();

            const res = float(0.0).toVar();

            If(tVar.lessThan(float(0)), () => {
                tVar.add(float(1));
            });
            If(tVar.greaterThan(float(1)), () => {
                tVar.sub(float(1));
            });
            If(tVar.lessThan(float(1).div(float(6))), () => {
                res.assign(pVar.add((qVar.sub(pVar)).mul(tVar.mul(float(6)))));
            })
                .ElseIf(tVar.lessThan(float(0.5)), () => {
                    res.assign(qVar);
                })
                .ElseIf(tVar.lessThan(float(2).div(float(3))), () => {
                    res.assign(pVar.add((qVar.sub(pVar)).mul(float(2).div(float(3)).sub(tVar)).mul(float(6))));
                })
                .Else(() => {
                    res.assign(pVar);
                });

            return res;
        });

        const rgb2hsl = Fn(([c]) => {
            const h = float(0.0).toVar();
            const s = float(0.0).toVar();
            const l = float(0.0).toVar();
            const r = float(c.r);
            const g = float(c.g);
            const b = float(c.b);

            const cMin = min(r, min(g, b));
            const cMax = max(r, max(g, b));

            l.assign((cMax.add(cMin)).div(float(2)));

            If(cMax.greaterThan(cMin), () => {
                const delta = cMax.sub(cMin);
                s.assign(select(
                    l.lessThan(float(0)),
                    delta.div(cMax.add(cMin)),
                    delta.div(float(2.0).sub(cMax.add(cMin))),
                ));

                If(r.equal(cMax), () => { h.assign((g.sub(b)).div(delta)); })
                    .ElseIf(g.equal(cMax), () => { h.assign(float(2.0).add((b.sub(r)).div(delta))); })
                    .Else(() => { h.assign(float(4.0).add((r.sub(g)).div(delta))); });


                If(h.lessThan(float(0)), () => {
                    h.addAssign(float(6));
                });
                h.assign(h.div(float(6)));
            });
            return vec3(h, s, l);
        });

        const colorama = Fn(() => {

            const colorI = inputNode;

            const hslImage = rgb2hsl(colorI.rgb);

            const hsl1 = rgb2hsl(this.color1);
            const hsl2 = rgb2hsl(this.color2);


            const hueFinal = remap(hslImage.z, min(hsl1.x, hsl2.x), max(hsl1.x, hsl2.x), 0.0, 1.0);
            const hsl = vec3(hueFinal, mix(hsl1.yz, hsl2.yz, hueFinal.z));

            let color = hsl2rgb(hsl);
            //let color = vec3(hslImage.z);

            return color;

        });

        const outputNode = colorama();

        return outputNode;

    }

}

export default ColoramaNode;

/**
 * TSL function for creating a dot-screen node for post processing.
 *
 * @tsl
 * @function
 * @param {Node<vec4>} node - The node that represents the input of the effect.
 * @param {Color} [color1=new Color(1, 1, 0)] - The first color of the effect.
 * @param {Color} [color2=new Color(0, 1, 0)] - The second color of the effect.
 * @returns {ColoramaNode}
 */
export const colorama = (node, color1, color2) => nodeObject(new ColoramaNode(nodeObject(node), color1, color2));