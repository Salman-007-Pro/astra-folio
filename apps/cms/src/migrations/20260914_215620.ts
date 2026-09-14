import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_category" AS ENUM('Enterprise', 'Platform', 'Mobile', 'Creative');
  CREATE TYPE "public"."project_lifecycle" AS ENUM('Production', 'Proof of concept', 'In progress');
  CREATE TYPE "public"."enum_projects_preset" AS ENUM('connector', 'discovery', 'engine', 'mobile', 'garden');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_category" AS ENUM('Enterprise', 'Platform', 'Mobile', 'Creative');
  CREATE TYPE "public"."enum__projects_v_version_preset" AS ENUM('connector', 'discovery', 'engine', 'mobile', 'garden');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_experience_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experience_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_skills_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__skills_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."experiment_lifecycle" AS ENUM('Lab', 'Prototype', 'In progress');
  CREATE TYPE "public"."enum_experiments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experiments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_profile_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__profile_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_resume_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resume_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "projects_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "projects_constraints" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "projects_decisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "projects_architecture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"short_title" varchar,
  	"slug" varchar,
  	"outcome" varchar,
  	"category" "enum_projects_category",
  	"period" varchar,
  	"role" varchar,
  	"company" varchar,
  	"lifecycle" "project_lifecycle",
  	"preset" "enum_projects_preset",
  	"problem" varchar,
  	"contribution" varchar,
  	"impact" varchar,
  	"reflection" varchar,
  	"confidentiality" varchar,
  	"featured" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"external_link" varchar,
  	"repository_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"skills_id" integer,
  	"blog_posts_id" integer
  );
  
  CREATE TABLE "_projects_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_constraints" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_decisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_architecture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_short_title" varchar,
  	"version_slug" varchar,
  	"version_outcome" varchar,
  	"version_category" "enum__projects_v_version_category",
  	"version_period" varchar,
  	"version_role" varchar,
  	"version_company" varchar,
  	"version_lifecycle" "project_lifecycle",
  	"version_preset" "enum__projects_v_version_preset",
  	"version_problem" varchar,
  	"version_contribution" varchar,
  	"version_impact" varchar,
  	"version_reflection" varchar,
  	"version_confidentiality" varchar,
  	"version_featured" boolean DEFAULT true,
  	"version_order" numeric DEFAULT 0,
  	"version_external_link" varchar,
  	"version_repository_link" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"skills_id" integer,
  	"blog_posts_id" integer
  );
  
  CREATE TABLE "experience_evidence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "experience_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "experience" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company" varchar,
  	"role" varchar,
  	"period" varchar,
  	"location" varchar,
  	"summary" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_experience_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_experience_v_version_evidence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_experience_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_experience_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_company" varchar,
  	"version_role" varchar,
  	"version_period" varchar,
  	"version_location" varchar,
  	"version_summary" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__experience_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" varchar,
  	"description" varchar,
  	"icon_key" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_skills_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "skills_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_skills_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_category" varchar,
  	"version_description" varchar,
  	"version_icon_key" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__skills_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_skills_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "blog_posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "blog_posts_related_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"mdx" varchar,
  	"published_at" timestamp(3) with time zone,
  	"minutes" numeric,
  	"kind" varchar,
  	"series" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"canonical_override" varchar,
  	"cover_id" integer,
  	"author_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_blog_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_related_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_mdx" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_minutes" numeric,
  	"version_kind" varchar,
  	"version_series" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_canonical_override" varchar,
  	"version_cover_id" integer,
  	"version_author_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "experiments_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "experiments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"lifecycle" "experiment_lifecycle",
  	"description" varchar,
  	"demo_link" varchar,
  	"repository_link" varchar,
  	"learnings" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_experiments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_experiments_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_experiments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_lifecycle" "experiment_lifecycle",
  	"version_description" varchar,
  	"version_demo_link" varchar,
  	"version_repository_link" varchar,
  	"version_learnings" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__experiments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"projects_id" integer,
  	"experience_id" integer,
  	"skills_id" integer,
  	"blog_posts_id" integer,
  	"experiments_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"website_content" jsonb DEFAULT '{"title":"The Kinetic Garden","url":"https://salman-asif-kinetic-garden.salmanasif36.chatgpt.site","brandName":"salman asif","brandMark":"s","defaultPalette":"garden","footer":"Thoughtfully built. Always evolving.","portrait":{"file":"salman-asif-portrait.png","caption":"Full-stack engineer"},"locationShort":"Al Khobar / Karachi","hero":{"eyebrow":"FULL-STACK ENGINEER. SYSTEMS THINKER.","title":"Full-stack engineering.","accent":"Thoughtful system design.","description":"I connect interfaces, APIs, data, and delivery to build reliable products—and design clear paths for them to grow."},"about":{"teaser":"I like the problems that look simple from the outside and have ten moving parts underneath.","summary":"I’ve spent 5+ years working where interfaces, backend services, and product expectations meet. Sometimes that means untangling state. Sometimes it means tracing a failure across the stack. Always, it means making the result easier for someone else to use.","currentRole":"Senior Software Engineer","currentCompany":"Veeam · Securiti AI","interests":["Creative WebGL","Realtime systems","AI product ideas","Developer workflows"],"sections":[{"title":"Start with the whole picture.","paragraphs":["I’m Salman, a full-stack engineer with a strong frontend foundation. The work I enjoy most sits between product behavior, service contracts, state, and the small interface details that make a difficult workflow feel obvious.","My path has taken me from startup React products and React Native apps to enterprise privacy and data-security systems. Along the way, I’ve learned that a reliable interface starts well before the component: in the contract, the state model, the failure paths, and the decisions about what happens next."]},{"title":"Fix the cause. Keep the system clear.","paragraphs":["When a production issue crosses several layers, I follow it. That can mean tracing Vuex state, checking an API payload, working through a Go or Python service response, or investigating a difference in a deployment environment.","I like architecture that a team can keep working with. Reusable patterns, explicit state, and a smaller change surface are often more valuable than an impressive abstraction that only one person understands."]},{"title":"Make room for curiosity.","paragraphs":["This garden is a place to explore the more playful side of that thinking. Three.js, motion, and interactive systems let me turn otherwise invisible connections into something tangible.","I’m interested in problems that need someone to move comfortably between product questions and implementation detail — and stay with the work through review, release, and the next iteration."]}]},"education":"BS Software Engineering · Sir Syed University of Engineering and Technology · 2017–2020","languages":["English","Urdu"],"games":{"enabled":true,"title":"A little play. A fresh perspective.","intro":"Four small games for a break between the big ideas. Pick one and make your next move.","winQuotes":["Small moves. Clear focus. That’s how good things come together.","You stayed with it. Let that momentum follow you into the next challenge.","Progress is built one thoughtful move at a time."],"lossQuotes":["A reset is another chance to try a better idea.","One round doesn’t define you. The next move is still yours.","Take a breath. Keep the lesson. Try again when you’re ready."]},"techLab":{"title":"The stack, in motion.","intro":"Explore the tools I use—and a small example of what they make possible.","systemTitle":"From a request to a reliable system.","technologies":[{"id":"html","name":"HTML","category":"Web foundations","preset":"layout","description":"Semantic structure gives every layer a purpose.","code":"<article>\n  <h2>A useful idea</h2>\n  <p>Structure before decoration.</p>\n</article>","projects":[]},{"id":"css","name":"CSS","category":"Web foundations","preset":"layout","description":"Change layout and spacing without changing the content.","code":".cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}","projects":[]},{"id":"javascript","name":"JavaScript","category":"Web foundations","preset":"state","description":"An event updates state and the interface responds.","code":"let count = 0;\nbutton.addEventListener(\"click\", () => {\n  output.textContent = ++count;\n});","projects":[]},{"id":"typescript","name":"TypeScript","category":"Web foundations","preset":"contract","description":"Explicit contracts make invalid states easier to catch.","code":"type Result =\n  | { ok: true; value: number }\n  | { ok: false; error: string };","projects":["kinetic-garden"]},{"id":"react","name":"React","category":"Frontend frameworks","preset":"state","description":"A state update refreshes the component that owns it.","code":"const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>\n  {count}\n</button>","projects":["cargobarn","kinetic-garden"]},{"id":"vue","name":"Vue","category":"Frontend frameworks","preset":"state","description":"Reactive data keeps the template connected to its source.","code":"const count = ref(0);\n// Template\n<button @click=\"count++\">{{ count }}</button>","projects":["metadata-driven-connectors","discovery-workflows","build-modernization"]},{"id":"next-js","name":"Next.js","category":"Frontend frameworks","preset":"route","description":"Server-rendered routes can contain focused client interactions.","code":"export default async function Page() {\n  const product = await getProduct();\n  return <ProductDetails product={product} />;\n}","projects":[]},{"id":"nuxt","name":"Nuxt","category":"Frontend frameworks","preset":"route","description":"Route data and a reactive view work together across rendering boundaries.","code":"const { data: product } = await useAsyncData(\n  \"product\", () => $fetch(\"/api/product\")\n);","projects":[]},{"id":"angular","name":"Angular","category":"Frontend frameworks","preset":"contract","description":"Form validation guards the boundary between input and application state.","code":"const name = new FormControl(\"\", {\n  nonNullable: true,\n  validators: [Validators.required]\n});","projects":[]},{"id":"svelte-sveltekit","name":"Svelte/SvelteKit","category":"Frontend frameworks","preset":"route","description":"Small reactive updates sit alongside route-level data loading.","code":"let count = $state(0);\n// +page.server.ts\nexport const load = async () => ({ title: \"Hello\" });","projects":[]},{"id":"astro","name":"Astro","category":"Frontend frameworks","preset":"island","description":"HTML arrives first; interactive islands activate where they are useful.","code":"---\nimport Counter from \"./Counter.jsx\";\n---\n<Counter client:visible />","projects":["kinetic-garden"]},{"id":"redux","name":"Redux","category":"State and mobile","preset":"store","description":"An action reaches the store before connected views receive the new state.","code":"dispatch(counterSlice.actions.increment());\nconst value = useSelector(state => state.counter.value);","projects":["cargobarn"]},{"id":"vuex","name":"Vuex","category":"State and mobile","preset":"store","description":"A mutation keeps shared state changes explicit.","code":"mutations: {\n  increment(state) { state.count++; }\n}\nstore.commit(\"increment\");","projects":["metadata-driven-connectors","discovery-workflows"]},{"id":"react-native","name":"React Native","category":"State and mobile","preset":"mobile","description":"Touch navigation connects focused screens in a mobile workflow.","code":"<Pressable onPress={() => navigation.navigate(\"Details\")}>\n  <Text>View shipment</Text>\n</Pressable>","projects":["cargobarn"]},{"id":"node-js","name":"Node.js","category":"Backend and APIs","preset":"event","description":"Queued callbacks demonstrate the difference between synchronous work and later execution.","code":"console.log(\"start\");\nqueueMicrotask(() => console.log(\"microtask\"));\nsetTimeout(() => console.log(\"timer\"), 0);\nconsole.log(\"end\");","projects":[]},{"id":"express","name":"Express","category":"Backend and APIs","preset":"middleware","description":"Middleware handles shared concerns before a route returns a response.","code":"app.get(\"/orders\", authenticate, async (req, res) => {\n  res.json(await listOrders(req.user.id));\n});","projects":[]},{"id":"nestjs","name":"NestJS","category":"Backend and APIs","preset":"middleware","description":"Controllers accept requests while services own application behavior.","code":"@Get(\"orders\")\nlist() {\n  return this.ordersService.findAll();\n}","projects":[]},{"id":"go","name":"Go","category":"Backend and APIs","preset":"request","description":"A handler makes request processing and failure paths explicit.","code":"func orders(w http.ResponseWriter, r *http.Request) {\n  w.Header().Set(\"Content-Type\", \"application/json\")\n  json.NewEncoder(w).Encode([]string{\"order-1\"})\n}","projects":["metadata-driven-connectors","discovery-workflows"]},{"id":"python","name":"Python","category":"Backend and APIs","preset":"request","description":"Service logic transforms data into a predictable response.","code":"def summarize(orders):\n    return {\n        \"count\": len(orders),\n        \"total\": sum(o[\"total\"] for o in orders)\n    }","projects":["metadata-driven-connectors","discovery-workflows"]},{"id":"rest-apis","name":"REST APIs","category":"Backend and APIs","preset":"request","description":"Resources, status codes and recoverable errors form a usable contract.","code":"GET /api/orders/42\n\n200 OK\n{ \"id\": 42, \"status\": \"ready\" }","projects":["metadata-driven-connectors","discovery-workflows","cargobarn"]},{"id":"postgresql","name":"PostgreSQL","category":"Databases and caching","preset":"query","description":"Relational records and indexes support explicit query patterns.","code":"CREATE INDEX orders_customer ON orders(customer_id);\nSELECT id FROM orders WHERE customer_id = 42;","projects":[]},{"id":"mysql","name":"MySQL","category":"Databases and caching","preset":"query","description":"Select only the records and columns the workflow needs.","code":"CREATE INDEX orders_customer ON orders(customer_id);\nSELECT id, status FROM orders WHERE customer_id = 42;","projects":[]},{"id":"mongodb","name":"MongoDB","category":"Databases and caching","preset":"document","description":"Documents group related fields around the way an application reads them.","code":"db.orders.find({ customerId: 42 }, { status: 1 });\ndb.orders.createIndex({ customerId: 1 });","projects":[]},{"id":"redis","name":"Redis","category":"Databases and caching","preset":"cache","description":"A short-lived cache entry avoids repeating the same source read.","code":"const cached = await redis.get(key);\nif (cached) return JSON.parse(cached);\nawait redis.set(key, JSON.stringify(value), { EX: 60 });","projects":[]},{"id":"webpack","name":"Webpack","category":"Build and delivery","preset":"bundle","description":"Imports become a dependency graph and then distributable chunks.","code":"export default {\n  entry: \"./src/index.js\",\n  optimization: { splitChunks: { chunks: \"all\" } }\n};","projects":["build-modernization"]},{"id":"rsbuild","name":"Rsbuild","category":"Build and delivery","preset":"bundle","description":"A build pipeline turns source modules into deployable assets.","code":"export default defineConfig({\n  plugins: [pluginVue2()],\n  source: { entry: { index: \"./src/main.ts\" } }\n});","projects":["build-modernization"]},{"id":"rspack","name":"Rspack","category":"Build and delivery","preset":"bundle","description":"Module boundaries shape how bundles are assembled and loaded.","code":"export default {\n  entry: \"./src/main.ts\",\n  output: { filename: \"[name].[contenthash].js\" }\n};","projects":["build-modernization"]},{"id":"git","name":"Git","category":"Build and delivery","preset":"pipeline","description":"A reviewed change moves through a traceable delivery sequence.","code":"git switch -c feature/order-status\ngit diff --check\ngit commit -m \"Clarify order status\"","projects":[]},{"id":"github-actions","name":"GitHub Actions","category":"Build and delivery","preset":"pipeline","description":"Automated checks gate delivery before an artifact is released.","code":"steps:\n  - run: pnpm install --frozen-lockfile\n  - run: pnpm test\n  - run: pnpm build","projects":[]},{"id":"docker","name":"Docker","category":"Build and delivery","preset":"container","description":"A packaged process carries its runtime and application together.","code":"FROM node:24-alpine\nWORKDIR /app\nCOPY . .\nCMD [\"node\", \"server.js\"]","projects":["build-modernization"]},{"id":"kubernetes","name":"Kubernetes","category":"Build and delivery","preset":"routing","description":"Healthy replicas share requests while failed instances leave the route.","code":"spec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: orders","projects":["build-modernization"]},{"id":"vitest","name":"Vitest","category":"Testing","preset":"test","description":"A focused assertion checks an observable behavior.","code":"it(\"totals prices\", () => {\n  expect(total([10, 15])).toBe(25);\n});","projects":[]},{"id":"jest","name":"Jest","category":"Testing","preset":"test","description":"Repeatable assertions catch regressions before release.","code":"test(\"rejects an empty name\", () => {\n  expect(validateName(\"\")).toEqual({ valid: false });\n});","projects":[]},{"id":"playwright","name":"Playwright","category":"Testing","preset":"browser","description":"A browser workflow verifies what a visitor can actually do.","code":"await page.getByLabel(\"Name\").fill(\"Salman\");\nawait page.getByRole(\"button\", { name: \"Save\" }).click();\nawait expect(page.getByRole(\"status\")).toHaveText(\"Saved\");","projects":[]},{"id":"three-js","name":"Three.js","category":"Creative and content","preset":"mesh","description":"Geometry, light and materials create a small interactive spatial object.","code":"const mesh = new THREE.Mesh(\n  new THREE.IcosahedronGeometry(1),\n  new THREE.MeshStandardMaterial({ color: 0x4488cc })\n);","projects":["kinetic-garden"]},{"id":"payload","name":"Payload","category":"Creative and content","preset":"publish","description":"A published content record moves into a readable page preview.","code":"const post = await payload.findByID({\n  collection: \"posts\", id: \"example\"\n});\n// Render the published record in the frontend.","projects":["kinetic-garden"]},{"id":"blockchain-dapps","name":"Blockchain / dApps","category":"Web3","preset":"wallet","description":"Wallet and transaction states need clear user consent, feedback and recovery.","code":"// Illustrative states; no wallet is connected here.\ntype Transaction =\n  \"disconnected\" | \"approval\" | \"pending\" |\n  \"confirmed\" | \"rejected\";","projects":[]}],"scenarios":[{"id":"routing","preset":"routing","title":"Request routing & scaling","explanation":"A router sends work to healthy replicas.","why":"Availability depends on health signals as well as capacity.","tradeoff":"More replicas add coordination and operational cost. A modular monolith can keep boundaries clear in one deployment; separate services add independent deployment and network failure modes."},{"id":"query","preset":"query","title":"Data modeling & queries","explanation":"Choose a relational or document view and trace a lookup.","why":"Model data around access patterns and consistency needs.","tradeoff":"Indexes cost storage and writes. Documents simplify some reads; relational constraints make relationships explicit."},{"id":"cache","preset":"cache","title":"Caching","explanation":"Read from the source once, then serve a cached value until it expires.","why":"Avoid repeated source work while making freshness explicit.","tradeoff":"Cached data can become stale. Expiry and invalidation need deliberate rules."},{"id":"jobs","preset":"jobs","title":"Background jobs","explanation":"Queue a job, retry a failed attempt and suppress duplicate work.","why":"Long-running work should survive transient failures.","tradeoff":"Retries can repeat side effects. An idempotency key makes duplicate handling explicit."},{"id":"auth","preset":"auth","title":"Authentication & authorization","explanation":"Identify the caller, then check permission to perform an admin action.","why":"Being signed in is different from being allowed to act.","tradeoff":"Central policy improves consistency, but permission changes and stale sessions need care."},{"id":"pipeline","preset":"pipeline","title":"Delivery & observability","explanation":"Follow a change through tests, build, deployment and a traced request.","why":"Checks and observable outcomes help teams detect and recover from failures.","tradeoff":"More telemetry costs storage and attention. Keep signals useful and avoid sensitive data in logs."}]},"motivation":{"enabled":true,"title":"A little perspective.","intro":"A few words to keep curiosity moving.","intervalSeconds":20,"quotes":[{"text":"The only way to do great work is to love what you do.","author":"Steve Jobs","sourceUrl":"https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says"},{"text":"Like what you do; then you will do your best.","author":"Katherine Johnson","sourceUrl":"https://science.nasa.gov/people/katherine-johnson/"},{"text":"Do what you can, with what you’ve got, where you are.","author":"Squire Bill Widener, quoted by Theodore Roosevelt","sourceUrl":"https://www.theodorerooseveltcenter.org/quote/do-what-you-can-with-what-youve-got-where-you-are/"},{"text":"Keep looking. Don’t settle.","author":"Steve Jobs","sourceUrl":"https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says"}]}}'::jsonb,
  	"description" varchar,
  	"canonical_domain" varchar,
  	"availability" varchar,
  	"footer" varchar,
  	"og_image_id" integer,
  	"analytics_enabled" boolean DEFAULT false,
  	"_status" "enum_site_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_settings_v_version_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title" varchar,
  	"version_website_content" jsonb DEFAULT '{"title":"The Kinetic Garden","url":"https://salman-asif-kinetic-garden.salmanasif36.chatgpt.site","brandName":"salman asif","brandMark":"s","defaultPalette":"garden","footer":"Thoughtfully built. Always evolving.","portrait":{"file":"salman-asif-portrait.png","caption":"Full-stack engineer"},"locationShort":"Al Khobar / Karachi","hero":{"eyebrow":"FULL-STACK ENGINEER. SYSTEMS THINKER.","title":"Full-stack engineering.","accent":"Thoughtful system design.","description":"I connect interfaces, APIs, data, and delivery to build reliable products—and design clear paths for them to grow."},"about":{"teaser":"I like the problems that look simple from the outside and have ten moving parts underneath.","summary":"I’ve spent 5+ years working where interfaces, backend services, and product expectations meet. Sometimes that means untangling state. Sometimes it means tracing a failure across the stack. Always, it means making the result easier for someone else to use.","currentRole":"Senior Software Engineer","currentCompany":"Veeam · Securiti AI","interests":["Creative WebGL","Realtime systems","AI product ideas","Developer workflows"],"sections":[{"title":"Start with the whole picture.","paragraphs":["I’m Salman, a full-stack engineer with a strong frontend foundation. The work I enjoy most sits between product behavior, service contracts, state, and the small interface details that make a difficult workflow feel obvious.","My path has taken me from startup React products and React Native apps to enterprise privacy and data-security systems. Along the way, I’ve learned that a reliable interface starts well before the component: in the contract, the state model, the failure paths, and the decisions about what happens next."]},{"title":"Fix the cause. Keep the system clear.","paragraphs":["When a production issue crosses several layers, I follow it. That can mean tracing Vuex state, checking an API payload, working through a Go or Python service response, or investigating a difference in a deployment environment.","I like architecture that a team can keep working with. Reusable patterns, explicit state, and a smaller change surface are often more valuable than an impressive abstraction that only one person understands."]},{"title":"Make room for curiosity.","paragraphs":["This garden is a place to explore the more playful side of that thinking. Three.js, motion, and interactive systems let me turn otherwise invisible connections into something tangible.","I’m interested in problems that need someone to move comfortably between product questions and implementation detail — and stay with the work through review, release, and the next iteration."]}]},"education":"BS Software Engineering · Sir Syed University of Engineering and Technology · 2017–2020","languages":["English","Urdu"],"games":{"enabled":true,"title":"A little play. A fresh perspective.","intro":"Four small games for a break between the big ideas. Pick one and make your next move.","winQuotes":["Small moves. Clear focus. That’s how good things come together.","You stayed with it. Let that momentum follow you into the next challenge.","Progress is built one thoughtful move at a time."],"lossQuotes":["A reset is another chance to try a better idea.","One round doesn’t define you. The next move is still yours.","Take a breath. Keep the lesson. Try again when you’re ready."]},"techLab":{"title":"The stack, in motion.","intro":"Explore the tools I use—and a small example of what they make possible.","systemTitle":"From a request to a reliable system.","technologies":[{"id":"html","name":"HTML","category":"Web foundations","preset":"layout","description":"Semantic structure gives every layer a purpose.","code":"<article>\n  <h2>A useful idea</h2>\n  <p>Structure before decoration.</p>\n</article>","projects":[]},{"id":"css","name":"CSS","category":"Web foundations","preset":"layout","description":"Change layout and spacing without changing the content.","code":".cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}","projects":[]},{"id":"javascript","name":"JavaScript","category":"Web foundations","preset":"state","description":"An event updates state and the interface responds.","code":"let count = 0;\nbutton.addEventListener(\"click\", () => {\n  output.textContent = ++count;\n});","projects":[]},{"id":"typescript","name":"TypeScript","category":"Web foundations","preset":"contract","description":"Explicit contracts make invalid states easier to catch.","code":"type Result =\n  | { ok: true; value: number }\n  | { ok: false; error: string };","projects":["kinetic-garden"]},{"id":"react","name":"React","category":"Frontend frameworks","preset":"state","description":"A state update refreshes the component that owns it.","code":"const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>\n  {count}\n</button>","projects":["cargobarn","kinetic-garden"]},{"id":"vue","name":"Vue","category":"Frontend frameworks","preset":"state","description":"Reactive data keeps the template connected to its source.","code":"const count = ref(0);\n// Template\n<button @click=\"count++\">{{ count }}</button>","projects":["metadata-driven-connectors","discovery-workflows","build-modernization"]},{"id":"next-js","name":"Next.js","category":"Frontend frameworks","preset":"route","description":"Server-rendered routes can contain focused client interactions.","code":"export default async function Page() {\n  const product = await getProduct();\n  return <ProductDetails product={product} />;\n}","projects":[]},{"id":"nuxt","name":"Nuxt","category":"Frontend frameworks","preset":"route","description":"Route data and a reactive view work together across rendering boundaries.","code":"const { data: product } = await useAsyncData(\n  \"product\", () => $fetch(\"/api/product\")\n);","projects":[]},{"id":"angular","name":"Angular","category":"Frontend frameworks","preset":"contract","description":"Form validation guards the boundary between input and application state.","code":"const name = new FormControl(\"\", {\n  nonNullable: true,\n  validators: [Validators.required]\n});","projects":[]},{"id":"svelte-sveltekit","name":"Svelte/SvelteKit","category":"Frontend frameworks","preset":"route","description":"Small reactive updates sit alongside route-level data loading.","code":"let count = $state(0);\n// +page.server.ts\nexport const load = async () => ({ title: \"Hello\" });","projects":[]},{"id":"astro","name":"Astro","category":"Frontend frameworks","preset":"island","description":"HTML arrives first; interactive islands activate where they are useful.","code":"---\nimport Counter from \"./Counter.jsx\";\n---\n<Counter client:visible />","projects":["kinetic-garden"]},{"id":"redux","name":"Redux","category":"State and mobile","preset":"store","description":"An action reaches the store before connected views receive the new state.","code":"dispatch(counterSlice.actions.increment());\nconst value = useSelector(state => state.counter.value);","projects":["cargobarn"]},{"id":"vuex","name":"Vuex","category":"State and mobile","preset":"store","description":"A mutation keeps shared state changes explicit.","code":"mutations: {\n  increment(state) { state.count++; }\n}\nstore.commit(\"increment\");","projects":["metadata-driven-connectors","discovery-workflows"]},{"id":"react-native","name":"React Native","category":"State and mobile","preset":"mobile","description":"Touch navigation connects focused screens in a mobile workflow.","code":"<Pressable onPress={() => navigation.navigate(\"Details\")}>\n  <Text>View shipment</Text>\n</Pressable>","projects":["cargobarn"]},{"id":"node-js","name":"Node.js","category":"Backend and APIs","preset":"event","description":"Queued callbacks demonstrate the difference between synchronous work and later execution.","code":"console.log(\"start\");\nqueueMicrotask(() => console.log(\"microtask\"));\nsetTimeout(() => console.log(\"timer\"), 0);\nconsole.log(\"end\");","projects":[]},{"id":"express","name":"Express","category":"Backend and APIs","preset":"middleware","description":"Middleware handles shared concerns before a route returns a response.","code":"app.get(\"/orders\", authenticate, async (req, res) => {\n  res.json(await listOrders(req.user.id));\n});","projects":[]},{"id":"nestjs","name":"NestJS","category":"Backend and APIs","preset":"middleware","description":"Controllers accept requests while services own application behavior.","code":"@Get(\"orders\")\nlist() {\n  return this.ordersService.findAll();\n}","projects":[]},{"id":"go","name":"Go","category":"Backend and APIs","preset":"request","description":"A handler makes request processing and failure paths explicit.","code":"func orders(w http.ResponseWriter, r *http.Request) {\n  w.Header().Set(\"Content-Type\", \"application/json\")\n  json.NewEncoder(w).Encode([]string{\"order-1\"})\n}","projects":["metadata-driven-connectors","discovery-workflows"]},{"id":"python","name":"Python","category":"Backend and APIs","preset":"request","description":"Service logic transforms data into a predictable response.","code":"def summarize(orders):\n    return {\n        \"count\": len(orders),\n        \"total\": sum(o[\"total\"] for o in orders)\n    }","projects":["metadata-driven-connectors","discovery-workflows"]},{"id":"rest-apis","name":"REST APIs","category":"Backend and APIs","preset":"request","description":"Resources, status codes and recoverable errors form a usable contract.","code":"GET /api/orders/42\n\n200 OK\n{ \"id\": 42, \"status\": \"ready\" }","projects":["metadata-driven-connectors","discovery-workflows","cargobarn"]},{"id":"postgresql","name":"PostgreSQL","category":"Databases and caching","preset":"query","description":"Relational records and indexes support explicit query patterns.","code":"CREATE INDEX orders_customer ON orders(customer_id);\nSELECT id FROM orders WHERE customer_id = 42;","projects":[]},{"id":"mysql","name":"MySQL","category":"Databases and caching","preset":"query","description":"Select only the records and columns the workflow needs.","code":"CREATE INDEX orders_customer ON orders(customer_id);\nSELECT id, status FROM orders WHERE customer_id = 42;","projects":[]},{"id":"mongodb","name":"MongoDB","category":"Databases and caching","preset":"document","description":"Documents group related fields around the way an application reads them.","code":"db.orders.find({ customerId: 42 }, { status: 1 });\ndb.orders.createIndex({ customerId: 1 });","projects":[]},{"id":"redis","name":"Redis","category":"Databases and caching","preset":"cache","description":"A short-lived cache entry avoids repeating the same source read.","code":"const cached = await redis.get(key);\nif (cached) return JSON.parse(cached);\nawait redis.set(key, JSON.stringify(value), { EX: 60 });","projects":[]},{"id":"webpack","name":"Webpack","category":"Build and delivery","preset":"bundle","description":"Imports become a dependency graph and then distributable chunks.","code":"export default {\n  entry: \"./src/index.js\",\n  optimization: { splitChunks: { chunks: \"all\" } }\n};","projects":["build-modernization"]},{"id":"rsbuild","name":"Rsbuild","category":"Build and delivery","preset":"bundle","description":"A build pipeline turns source modules into deployable assets.","code":"export default defineConfig({\n  plugins: [pluginVue2()],\n  source: { entry: { index: \"./src/main.ts\" } }\n});","projects":["build-modernization"]},{"id":"rspack","name":"Rspack","category":"Build and delivery","preset":"bundle","description":"Module boundaries shape how bundles are assembled and loaded.","code":"export default {\n  entry: \"./src/main.ts\",\n  output: { filename: \"[name].[contenthash].js\" }\n};","projects":["build-modernization"]},{"id":"git","name":"Git","category":"Build and delivery","preset":"pipeline","description":"A reviewed change moves through a traceable delivery sequence.","code":"git switch -c feature/order-status\ngit diff --check\ngit commit -m \"Clarify order status\"","projects":[]},{"id":"github-actions","name":"GitHub Actions","category":"Build and delivery","preset":"pipeline","description":"Automated checks gate delivery before an artifact is released.","code":"steps:\n  - run: pnpm install --frozen-lockfile\n  - run: pnpm test\n  - run: pnpm build","projects":[]},{"id":"docker","name":"Docker","category":"Build and delivery","preset":"container","description":"A packaged process carries its runtime and application together.","code":"FROM node:24-alpine\nWORKDIR /app\nCOPY . .\nCMD [\"node\", \"server.js\"]","projects":["build-modernization"]},{"id":"kubernetes","name":"Kubernetes","category":"Build and delivery","preset":"routing","description":"Healthy replicas share requests while failed instances leave the route.","code":"spec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: orders","projects":["build-modernization"]},{"id":"vitest","name":"Vitest","category":"Testing","preset":"test","description":"A focused assertion checks an observable behavior.","code":"it(\"totals prices\", () => {\n  expect(total([10, 15])).toBe(25);\n});","projects":[]},{"id":"jest","name":"Jest","category":"Testing","preset":"test","description":"Repeatable assertions catch regressions before release.","code":"test(\"rejects an empty name\", () => {\n  expect(validateName(\"\")).toEqual({ valid: false });\n});","projects":[]},{"id":"playwright","name":"Playwright","category":"Testing","preset":"browser","description":"A browser workflow verifies what a visitor can actually do.","code":"await page.getByLabel(\"Name\").fill(\"Salman\");\nawait page.getByRole(\"button\", { name: \"Save\" }).click();\nawait expect(page.getByRole(\"status\")).toHaveText(\"Saved\");","projects":[]},{"id":"three-js","name":"Three.js","category":"Creative and content","preset":"mesh","description":"Geometry, light and materials create a small interactive spatial object.","code":"const mesh = new THREE.Mesh(\n  new THREE.IcosahedronGeometry(1),\n  new THREE.MeshStandardMaterial({ color: 0x4488cc })\n);","projects":["kinetic-garden"]},{"id":"payload","name":"Payload","category":"Creative and content","preset":"publish","description":"A published content record moves into a readable page preview.","code":"const post = await payload.findByID({\n  collection: \"posts\", id: \"example\"\n});\n// Render the published record in the frontend.","projects":["kinetic-garden"]},{"id":"blockchain-dapps","name":"Blockchain / dApps","category":"Web3","preset":"wallet","description":"Wallet and transaction states need clear user consent, feedback and recovery.","code":"// Illustrative states; no wallet is connected here.\ntype Transaction =\n  \"disconnected\" | \"approval\" | \"pending\" |\n  \"confirmed\" | \"rejected\";","projects":[]}],"scenarios":[{"id":"routing","preset":"routing","title":"Request routing & scaling","explanation":"A router sends work to healthy replicas.","why":"Availability depends on health signals as well as capacity.","tradeoff":"More replicas add coordination and operational cost. A modular monolith can keep boundaries clear in one deployment; separate services add independent deployment and network failure modes."},{"id":"query","preset":"query","title":"Data modeling & queries","explanation":"Choose a relational or document view and trace a lookup.","why":"Model data around access patterns and consistency needs.","tradeoff":"Indexes cost storage and writes. Documents simplify some reads; relational constraints make relationships explicit."},{"id":"cache","preset":"cache","title":"Caching","explanation":"Read from the source once, then serve a cached value until it expires.","why":"Avoid repeated source work while making freshness explicit.","tradeoff":"Cached data can become stale. Expiry and invalidation need deliberate rules."},{"id":"jobs","preset":"jobs","title":"Background jobs","explanation":"Queue a job, retry a failed attempt and suppress duplicate work.","why":"Long-running work should survive transient failures.","tradeoff":"Retries can repeat side effects. An idempotency key makes duplicate handling explicit."},{"id":"auth","preset":"auth","title":"Authentication & authorization","explanation":"Identify the caller, then check permission to perform an admin action.","why":"Being signed in is different from being allowed to act.","tradeoff":"Central policy improves consistency, but permission changes and stale sessions need care."},{"id":"pipeline","preset":"pipeline","title":"Delivery & observability","explanation":"Follow a change through tests, build, deployment and a traced request.","why":"Checks and observable outcomes help teams detect and recover from failures.","tradeoff":"More telemetry costs storage and attention. Keep signals useful and avoid sensitive data in logs."}]},"motivation":{"enabled":true,"title":"A little perspective.","intro":"A few words to keep curiosity moving.","intervalSeconds":20,"quotes":[{"text":"The only way to do great work is to love what you do.","author":"Steve Jobs","sourceUrl":"https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says"},{"text":"Like what you do; then you will do your best.","author":"Katherine Johnson","sourceUrl":"https://science.nasa.gov/people/katherine-johnson/"},{"text":"Do what you can, with what you’ve got, where you are.","author":"Squire Bill Widener, quoted by Theodore Roosevelt","sourceUrl":"https://www.theodorerooseveltcenter.org/quote/do-what-you-can-with-what-youve-got-where-you-are/"},{"text":"Keep looking. Don’t settle.","author":"Steve Jobs","sourceUrl":"https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says"}]}}'::jsonb,
  	"version_description" varchar,
  	"version_canonical_domain" varchar,
  	"version_availability" varchar,
  	"version_footer" varchar,
  	"version_og_image_id" integer,
  	"version_analytics_enabled" boolean DEFAULT false,
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "profile_collaboration_whatsapp_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"number" varchar
  );
  
  CREATE TABLE "profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"full_name" varchar,
  	"role" varchar,
  	"intro" varchar,
  	"location" varchar,
  	"email" varchar,
  	"github" varchar,
  	"linkedin" varchar,
  	"experience_label" varchar,
  	"current_focus" varchar,
  	"collaboration_availability" varchar DEFAULT 'Remote · On-site · Open to relocation',
  	"collaboration_locations" varchar DEFAULT 'Al Khobar, Saudi Arabia · Karachi, Pakistan',
  	"collaboration_currencies" varchar DEFAULT 'USD / EUR',
  	"collaboration_call_number" varchar DEFAULT '+92 332 1318363',
  	"collaboration_whatsapp_number" varchar DEFAULT '+966 56 379 1037',
  	"collaboration_summary" varchar DEFAULT 'I’m open to remote and on-site full-stack engineering roles, with flexibility to relocate for the right opportunity. I collaborate with teams worldwide, bringing experience across product interfaces, backend services, and delivery.',
  	"long_narrative" varchar,
  	"avatar_id" integer,
  	"_status" "enum_profile_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_profile_v_version_collaboration_whatsapp_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"number" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar,
  	"version_full_name" varchar,
  	"version_role" varchar,
  	"version_intro" varchar,
  	"version_location" varchar,
  	"version_email" varchar,
  	"version_github" varchar,
  	"version_linkedin" varchar,
  	"version_experience_label" varchar,
  	"version_current_focus" varchar,
  	"version_collaboration_availability" varchar DEFAULT 'Remote · On-site · Open to relocation',
  	"version_collaboration_locations" varchar DEFAULT 'Al Khobar, Saudi Arabia · Karachi, Pakistan',
  	"version_collaboration_currencies" varchar DEFAULT 'USD / EUR',
  	"version_collaboration_call_number" varchar DEFAULT '+92 332 1318363',
  	"version_collaboration_whatsapp_number" varchar DEFAULT '+966 56 379 1037',
  	"version_collaboration_summary" varchar DEFAULT 'I’m open to remote and on-site full-stack engineering roles, with flexibility to relocate for the right opportunity. I collaborate with teams worldwide, bringing experience across product interfaces, backend services, and delivery.',
  	"version_long_narrative" varchar,
  	"version_avatar_id" integer,
  	"version__status" "enum__profile_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "resume_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"current_pdf_id" integer,
  	"filename" varchar,
  	"version_date" timestamp(3) with time zone,
  	"download_enabled" boolean DEFAULT true,
  	"changelog" varchar,
  	"_status" "enum_resume_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_resume_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_current_pdf_id" integer,
  	"version_filename" varchar,
  	"version_version_date" timestamp(3) with time zone,
  	"version_download_enabled" boolean DEFAULT true,
  	"version_changelog" varchar,
  	"version__status" "enum__resume_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_stack" ADD CONSTRAINT "projects_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_constraints" ADD CONSTRAINT "projects_constraints_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_decisions" ADD CONSTRAINT "projects_decisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_architecture" ADD CONSTRAINT "projects_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_stack" ADD CONSTRAINT "_projects_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_constraints" ADD CONSTRAINT "_projects_v_version_constraints_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_decisions" ADD CONSTRAINT "_projects_v_version_decisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_architecture" ADD CONSTRAINT "_projects_v_version_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experience_evidence" ADD CONSTRAINT "experience_evidence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experience_stack" ADD CONSTRAINT "experience_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experience_v_version_evidence" ADD CONSTRAINT "_experience_v_version_evidence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_experience_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experience_v_version_stack" ADD CONSTRAINT "_experience_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_experience_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experience_v" ADD CONSTRAINT "_experience_v_parent_id_experience_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experience"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "skills_rels" ADD CONSTRAINT "skills_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_rels" ADD CONSTRAINT "skills_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_skills_v" ADD CONSTRAINT "_skills_v_parent_id_skills_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."skills"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_skills_v_rels" ADD CONSTRAINT "_skills_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_skills_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_skills_v_rels" ADD CONSTRAINT "_skills_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_tags" ADD CONSTRAINT "blog_posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_related_projects" ADD CONSTRAINT "blog_posts_related_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_tags" ADD CONSTRAINT "_blog_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_related_projects" ADD CONSTRAINT "_blog_posts_v_version_related_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiments_stack" ADD CONSTRAINT "experiments_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experiments_v_version_stack" ADD CONSTRAINT "_experiments_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_experiments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experiments_v" ADD CONSTRAINT "_experiments_v_parent_id_experiments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experiments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experience_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experiments_fk" FOREIGN KEY ("experiments_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_navigation" ADD CONSTRAINT "_site_settings_v_version_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_collaboration_whatsapp_contacts" ADD CONSTRAINT "profile_collaboration_whatsapp_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_v_version_collaboration_whatsapp_contacts" ADD CONSTRAINT "_profile_v_version_collaboration_whatsapp_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_v" ADD CONSTRAINT "_profile_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resume_settings" ADD CONSTRAINT "resume_settings_current_pdf_id_media_id_fk" FOREIGN KEY ("current_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resume_settings_v" ADD CONSTRAINT "_resume_settings_v_version_current_pdf_id_media_id_fk" FOREIGN KEY ("version_current_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "projects_stack_order_idx" ON "projects_stack" USING btree ("_order");
  CREATE INDEX "projects_stack_parent_id_idx" ON "projects_stack" USING btree ("_parent_id");
  CREATE INDEX "projects_constraints_order_idx" ON "projects_constraints" USING btree ("_order");
  CREATE INDEX "projects_constraints_parent_id_idx" ON "projects_constraints" USING btree ("_parent_id");
  CREATE INDEX "projects_decisions_order_idx" ON "projects_decisions" USING btree ("_order");
  CREATE INDEX "projects_decisions_parent_id_idx" ON "projects_decisions" USING btree ("_parent_id");
  CREATE INDEX "projects_architecture_order_idx" ON "projects_architecture" USING btree ("_order");
  CREATE INDEX "projects_architecture_parent_id_idx" ON "projects_architecture" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "projects_rels_skills_id_idx" ON "projects_rels" USING btree ("skills_id");
  CREATE INDEX "projects_rels_blog_posts_id_idx" ON "projects_rels" USING btree ("blog_posts_id");
  CREATE INDEX "_projects_v_version_stack_order_idx" ON "_projects_v_version_stack" USING btree ("_order");
  CREATE INDEX "_projects_v_version_stack_parent_id_idx" ON "_projects_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_constraints_order_idx" ON "_projects_v_version_constraints" USING btree ("_order");
  CREATE INDEX "_projects_v_version_constraints_parent_id_idx" ON "_projects_v_version_constraints" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_decisions_order_idx" ON "_projects_v_version_decisions" USING btree ("_order");
  CREATE INDEX "_projects_v_version_decisions_parent_id_idx" ON "_projects_v_version_decisions" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_architecture_order_idx" ON "_projects_v_version_architecture" USING btree ("_order");
  CREATE INDEX "_projects_v_version_architecture_parent_id_idx" ON "_projects_v_version_architecture" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_rels_skills_id_idx" ON "_projects_v_rels" USING btree ("skills_id");
  CREATE INDEX "_projects_v_rels_blog_posts_id_idx" ON "_projects_v_rels" USING btree ("blog_posts_id");
  CREATE INDEX "experience_evidence_order_idx" ON "experience_evidence" USING btree ("_order");
  CREATE INDEX "experience_evidence_parent_id_idx" ON "experience_evidence" USING btree ("_parent_id");
  CREATE INDEX "experience_stack_order_idx" ON "experience_stack" USING btree ("_order");
  CREATE INDEX "experience_stack_parent_id_idx" ON "experience_stack" USING btree ("_parent_id");
  CREATE INDEX "experience_updated_at_idx" ON "experience" USING btree ("updated_at");
  CREATE INDEX "experience_created_at_idx" ON "experience" USING btree ("created_at");
  CREATE INDEX "experience__status_idx" ON "experience" USING btree ("_status");
  CREATE INDEX "_experience_v_version_evidence_order_idx" ON "_experience_v_version_evidence" USING btree ("_order");
  CREATE INDEX "_experience_v_version_evidence_parent_id_idx" ON "_experience_v_version_evidence" USING btree ("_parent_id");
  CREATE INDEX "_experience_v_version_stack_order_idx" ON "_experience_v_version_stack" USING btree ("_order");
  CREATE INDEX "_experience_v_version_stack_parent_id_idx" ON "_experience_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_experience_v_parent_idx" ON "_experience_v" USING btree ("parent_id");
  CREATE INDEX "_experience_v_version_version_updated_at_idx" ON "_experience_v" USING btree ("version_updated_at");
  CREATE INDEX "_experience_v_version_version_created_at_idx" ON "_experience_v" USING btree ("version_created_at");
  CREATE INDEX "_experience_v_version_version__status_idx" ON "_experience_v" USING btree ("version__status");
  CREATE INDEX "_experience_v_created_at_idx" ON "_experience_v" USING btree ("created_at");
  CREATE INDEX "_experience_v_updated_at_idx" ON "_experience_v" USING btree ("updated_at");
  CREATE INDEX "_experience_v_latest_idx" ON "_experience_v" USING btree ("latest");
  CREATE INDEX "_experience_v_autosave_idx" ON "_experience_v" USING btree ("autosave");
  CREATE INDEX "skills_updated_at_idx" ON "skills" USING btree ("updated_at");
  CREATE INDEX "skills_created_at_idx" ON "skills" USING btree ("created_at");
  CREATE INDEX "skills__status_idx" ON "skills" USING btree ("_status");
  CREATE INDEX "skills_rels_order_idx" ON "skills_rels" USING btree ("order");
  CREATE INDEX "skills_rels_parent_idx" ON "skills_rels" USING btree ("parent_id");
  CREATE INDEX "skills_rels_path_idx" ON "skills_rels" USING btree ("path");
  CREATE INDEX "skills_rels_projects_id_idx" ON "skills_rels" USING btree ("projects_id");
  CREATE INDEX "_skills_v_parent_idx" ON "_skills_v" USING btree ("parent_id");
  CREATE INDEX "_skills_v_version_version_updated_at_idx" ON "_skills_v" USING btree ("version_updated_at");
  CREATE INDEX "_skills_v_version_version_created_at_idx" ON "_skills_v" USING btree ("version_created_at");
  CREATE INDEX "_skills_v_version_version__status_idx" ON "_skills_v" USING btree ("version__status");
  CREATE INDEX "_skills_v_created_at_idx" ON "_skills_v" USING btree ("created_at");
  CREATE INDEX "_skills_v_updated_at_idx" ON "_skills_v" USING btree ("updated_at");
  CREATE INDEX "_skills_v_latest_idx" ON "_skills_v" USING btree ("latest");
  CREATE INDEX "_skills_v_autosave_idx" ON "_skills_v" USING btree ("autosave");
  CREATE INDEX "_skills_v_rels_order_idx" ON "_skills_v_rels" USING btree ("order");
  CREATE INDEX "_skills_v_rels_parent_idx" ON "_skills_v_rels" USING btree ("parent_id");
  CREATE INDEX "_skills_v_rels_path_idx" ON "_skills_v_rels" USING btree ("path");
  CREATE INDEX "_skills_v_rels_projects_id_idx" ON "_skills_v_rels" USING btree ("projects_id");
  CREATE INDEX "blog_posts_tags_order_idx" ON "blog_posts_tags" USING btree ("_order");
  CREATE INDEX "blog_posts_tags_parent_id_idx" ON "blog_posts_tags" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_related_projects_order_idx" ON "blog_posts_related_projects" USING btree ("_order");
  CREATE INDEX "blog_posts_related_projects_parent_id_idx" ON "blog_posts_related_projects" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_cover_idx" ON "blog_posts" USING btree ("cover_id");
  CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts__status_idx" ON "blog_posts" USING btree ("_status");
  CREATE INDEX "_blog_posts_v_version_tags_order_idx" ON "_blog_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_tags_parent_id_idx" ON "_blog_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_blog_posts_v_version_related_projects_order_idx" ON "_blog_posts_v_version_related_projects" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_related_projects_parent_id_idx" ON "_blog_posts_v_version_related_projects" USING btree ("_parent_id");
  CREATE INDEX "_blog_posts_v_parent_idx" ON "_blog_posts_v" USING btree ("parent_id");
  CREATE INDEX "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v" USING btree ("version_slug");
  CREATE INDEX "_blog_posts_v_version_version_cover_idx" ON "_blog_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_blog_posts_v_version_version_author_idx" ON "_blog_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_blog_posts_v_version_version_updated_at_idx" ON "_blog_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_posts_v_version_version_created_at_idx" ON "_blog_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_posts_v_version_version__status_idx" ON "_blog_posts_v" USING btree ("version__status");
  CREATE INDEX "_blog_posts_v_created_at_idx" ON "_blog_posts_v" USING btree ("created_at");
  CREATE INDEX "_blog_posts_v_updated_at_idx" ON "_blog_posts_v" USING btree ("updated_at");
  CREATE INDEX "_blog_posts_v_latest_idx" ON "_blog_posts_v" USING btree ("latest");
  CREATE INDEX "_blog_posts_v_autosave_idx" ON "_blog_posts_v" USING btree ("autosave");
  CREATE INDEX "experiments_stack_order_idx" ON "experiments_stack" USING btree ("_order");
  CREATE INDEX "experiments_stack_parent_id_idx" ON "experiments_stack" USING btree ("_parent_id");
  CREATE INDEX "experiments_updated_at_idx" ON "experiments" USING btree ("updated_at");
  CREATE INDEX "experiments_created_at_idx" ON "experiments" USING btree ("created_at");
  CREATE INDEX "experiments__status_idx" ON "experiments" USING btree ("_status");
  CREATE INDEX "_experiments_v_version_stack_order_idx" ON "_experiments_v_version_stack" USING btree ("_order");
  CREATE INDEX "_experiments_v_version_stack_parent_id_idx" ON "_experiments_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_experiments_v_parent_idx" ON "_experiments_v" USING btree ("parent_id");
  CREATE INDEX "_experiments_v_version_version_updated_at_idx" ON "_experiments_v" USING btree ("version_updated_at");
  CREATE INDEX "_experiments_v_version_version_created_at_idx" ON "_experiments_v" USING btree ("version_created_at");
  CREATE INDEX "_experiments_v_version_version__status_idx" ON "_experiments_v" USING btree ("version__status");
  CREATE INDEX "_experiments_v_created_at_idx" ON "_experiments_v" USING btree ("created_at");
  CREATE INDEX "_experiments_v_updated_at_idx" ON "_experiments_v" USING btree ("updated_at");
  CREATE INDEX "_experiments_v_latest_idx" ON "_experiments_v" USING btree ("latest");
  CREATE INDEX "_experiments_v_autosave_idx" ON "_experiments_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_experience_id_idx" ON "payload_locked_documents_rels" USING btree ("experience_id");
  CREATE INDEX "payload_locked_documents_rels_skills_id_idx" ON "payload_locked_documents_rels" USING btree ("skills_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_experiments_id_idx" ON "payload_locked_documents_rels" USING btree ("experiments_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE INDEX "_site_settings_v_version_navigation_order_idx" ON "_site_settings_v_version_navigation" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_navigation_parent_id_idx" ON "_site_settings_v_version_navigation" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version_og_image_idx" ON "_site_settings_v" USING btree ("version_og_image_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE INDEX "profile_collaboration_whatsapp_contacts_order_idx" ON "profile_collaboration_whatsapp_contacts" USING btree ("_order");
  CREATE INDEX "profile_collaboration_whatsapp_contacts_parent_id_idx" ON "profile_collaboration_whatsapp_contacts" USING btree ("_parent_id");
  CREATE INDEX "profile_avatar_idx" ON "profile" USING btree ("avatar_id");
  CREATE INDEX "profile__status_idx" ON "profile" USING btree ("_status");
  CREATE INDEX "_profile_v_version_collaboration_whatsapp_contacts_order_idx" ON "_profile_v_version_collaboration_whatsapp_contacts" USING btree ("_order");
  CREATE INDEX "_profile_v_version_collaboration_whatsapp_contacts_parent_id_idx" ON "_profile_v_version_collaboration_whatsapp_contacts" USING btree ("_parent_id");
  CREATE INDEX "_profile_v_version_version_avatar_idx" ON "_profile_v" USING btree ("version_avatar_id");
  CREATE INDEX "_profile_v_version_version__status_idx" ON "_profile_v" USING btree ("version__status");
  CREATE INDEX "_profile_v_created_at_idx" ON "_profile_v" USING btree ("created_at");
  CREATE INDEX "_profile_v_updated_at_idx" ON "_profile_v" USING btree ("updated_at");
  CREATE INDEX "_profile_v_latest_idx" ON "_profile_v" USING btree ("latest");
  CREATE INDEX "resume_settings_current_pdf_idx" ON "resume_settings" USING btree ("current_pdf_id");
  CREATE INDEX "resume_settings__status_idx" ON "resume_settings" USING btree ("_status");
  CREATE INDEX "_resume_settings_v_version_version_current_pdf_idx" ON "_resume_settings_v" USING btree ("version_current_pdf_id");
  CREATE INDEX "_resume_settings_v_version_version__status_idx" ON "_resume_settings_v" USING btree ("version__status");
  CREATE INDEX "_resume_settings_v_created_at_idx" ON "_resume_settings_v" USING btree ("created_at");
  CREATE INDEX "_resume_settings_v_updated_at_idx" ON "_resume_settings_v" USING btree ("updated_at");
  CREATE INDEX "_resume_settings_v_latest_idx" ON "_resume_settings_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "projects_stack" CASCADE;
  DROP TABLE "projects_constraints" CASCADE;
  DROP TABLE "projects_decisions" CASCADE;
  DROP TABLE "projects_architecture" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_stack" CASCADE;
  DROP TABLE "_projects_v_version_constraints" CASCADE;
  DROP TABLE "_projects_v_version_decisions" CASCADE;
  DROP TABLE "_projects_v_version_architecture" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "experience_evidence" CASCADE;
  DROP TABLE "experience_stack" CASCADE;
  DROP TABLE "experience" CASCADE;
  DROP TABLE "_experience_v_version_evidence" CASCADE;
  DROP TABLE "_experience_v_version_stack" CASCADE;
  DROP TABLE "_experience_v" CASCADE;
  DROP TABLE "skills" CASCADE;
  DROP TABLE "skills_rels" CASCADE;
  DROP TABLE "_skills_v" CASCADE;
  DROP TABLE "_skills_v_rels" CASCADE;
  DROP TABLE "blog_posts_tags" CASCADE;
  DROP TABLE "blog_posts_related_projects" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "_blog_posts_v_version_tags" CASCADE;
  DROP TABLE "_blog_posts_v_version_related_projects" CASCADE;
  DROP TABLE "_blog_posts_v" CASCADE;
  DROP TABLE "experiments_stack" CASCADE;
  DROP TABLE "experiments" CASCADE;
  DROP TABLE "_experiments_v_version_stack" CASCADE;
  DROP TABLE "_experiments_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "_site_settings_v_version_navigation" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "profile_collaboration_whatsapp_contacts" CASCADE;
  DROP TABLE "profile" CASCADE;
  DROP TABLE "_profile_v_version_collaboration_whatsapp_contacts" CASCADE;
  DROP TABLE "_profile_v" CASCADE;
  DROP TABLE "resume_settings" CASCADE;
  DROP TABLE "_resume_settings_v" CASCADE;
  DROP TYPE "public"."enum_projects_category";
  DROP TYPE "public"."project_lifecycle";
  DROP TYPE "public"."enum_projects_preset";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_category";
  DROP TYPE "public"."enum__projects_v_version_preset";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_experience_status";
  DROP TYPE "public"."enum__experience_v_version_status";
  DROP TYPE "public"."enum_skills_status";
  DROP TYPE "public"."enum__skills_v_version_status";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum__blog_posts_v_version_status";
  DROP TYPE "public"."experiment_lifecycle";
  DROP TYPE "public"."enum_experiments_status";
  DROP TYPE "public"."enum__experiments_v_version_status";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum_profile_status";
  DROP TYPE "public"."enum__profile_v_version_status";
  DROP TYPE "public"."enum_resume_settings_status";
  DROP TYPE "public"."enum__resume_settings_v_version_status";`)
}
