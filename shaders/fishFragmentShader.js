const fragmentShader = `
// Variables liées à la texture
// uniform sampler2D diffuse_map;
// uniform sampler2D shadowMap;

in vec2 frag_tex_coords;

// Variables liées au brouillard
in float visibility;
vec4 ocean_color = vec4(30.0/255.0, 60.0/255.0, 90.0/255.0, 1.0);

// Variables liées à la lumière
in vec3 w_position, w_normal;
vec3 light_dir = vec3(0, -1, 0);
vec3 k_d = vec3(1, 1, 0);
vec3 k_s = vec3(1, 1, 1);

in vec4 FragPosLightSpace;

// float ShadowCalculation(vec4 fragPosLightSpace)
// {
//     float bias = 0.005;
//     // perform perspective divide
//     vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
//     // transform to [0,1] range
//     projCoords = projCoords * 0.5 + 0.5;
//     // get closest depth value from light's perspective (using [0,1] range fragPosLight as coords)
//     float closestDepth = texture(shadowMap, projCoords.xy).r;
//     // get depth of current fragment from light's perspective
//     float currentDepth = projCoords.z;
//     // check whether current frag pos is in shadow
//     float shadow = currentDepth - bias > closestDepth   ? 0.5 : 0.0;
//     return shadow;
// }

void main() {
    // Calculs de la lumière
    vec3 n = normalize(w_normal);
    vec3 l = -normalize(transpose(inverse(mat3(viewMatrix))) * light_dir);
    vec3 v = normalize(- w_position);
    vec3 r = reflect(-l, n);

    // Ambiant light is directly put in lamber and specular light (max with 0.4)
    vec3 lambert = k_d * max(dot(n, l), 0.4);
    vec3 specular = k_s * pow(max(dot(r, v), 0.4), 32.0);
    // float shadow = ShadowCalculation(FragPosLightSpace);

    vec4 out_color = (vec4(specular, 1.0) + vec4(lambert, 1.0));
    gl_FragColor = mix(ocean_color, out_color, visibility);
}
`;

export default fragmentShader;
