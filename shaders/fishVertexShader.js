const vertexShader = `
uniform mat4 lightSpaceMatrix;

// Variables de l'animation
uniform float time;
uniform float wave;

// Variables de la texture
out vec2 frag_tex_coords;

// Variables de la lumière
out vec3 w_position, w_normal;
out vec4 FragPosLightSpace;

// Variables du brouillard
out float visibility;
const float density = 0.015;
const float gradient = 3.0;

layout(location = 2) in vec2 tex_position;


void main() {
    // Ajout de l'animation de l'objet
    vec3 newposition = position;
    float body = (newposition.z + 1.0) / 2.0;
    float mask = smoothstep(1.0, 2.0, 1.0 - body);
    newposition.x += cos(time + body) * mask * wave;


    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newposition, 1);


    frag_tex_coords = tex_position;

    // Lumière + position dans le monde
    w_position = vec3(viewMatrix * modelMatrix * vec4(newposition, 1.0));
    w_normal = transpose(inverse(mat3(viewMatrix * modelMatrix))) * normal;

    // mat4 lightview = lookat(vec3(0),light_dir,vec3(0,1,0));

    FragPosLightSpace =  lightSpaceMatrix * vec4(newposition, 1);

    float distance = length(w_position.xyz);
    visibility = exp(-pow(distance*density, gradient));
    visibility = clamp(visibility, 0.0, 1.0);
}

`;

export default vertexShader;
