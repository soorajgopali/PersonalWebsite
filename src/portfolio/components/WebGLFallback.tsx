import { personalInfo, experiences, personalProjects, skillCategories, education } from "../../data/portfolio";

export default function WebGLFallback() {
  return (
    <div className="min-h-screen bg-void text-ink-50">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-2xl">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-2 border-electric/30">
            <img
              src={personalInfo.profileImage}
              alt={personalInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-meta mb-4">{personalInfo.location}</p>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-[-0.04em] mb-4">{personalInfo.name}</h1>
          <p className="text-xl text-ink-300 mb-8">{personalInfo.title}</p>
          <p className="text-ink-400 leading-relaxed">{personalInfo.summary}</p>
        </div>
      </section>

      {/* Experience */}
      <section className="px-6 py-20 border-t border-ink-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Experience</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 mb-4">
                <span className="font-mono text-sm text-electric">{exp.period}</span>
                <h3 className="text-2xl font-bold">{exp.company}</h3>
                <span className="text-ink-500 text-sm">{exp.location}</span>
              </div>
              {exp.projects.map((project) => (
                <div key={project.name} className="mb-6 p-4 border border-ink-800/50 bg-deep/30">
                  <h4 className="text-lg font-semibold mb-2">{project.name}</h4>
                  <p className="text-ink-400 text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-[10px] font-mono bg-ink-800 text-ink-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="px-6 py-20 border-t border-ink-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Projects</h2>
          {personalProjects.map((project) => (
            <div key={project.name} className="mb-6 p-6 border border-ink-800/50 bg-deep/30">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-ink-400 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 text-[10px] font-mono bg-ink-800 text-ink-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 py-20 border-t border-ink-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Skills</h2>
          {skillCategories.map((category) => (
            <div key={category.id} className="mb-8">
              <h3 className="text-meta mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span key={skill.name} className="px-4 py-2 border border-ink-700 bg-deep/30 text-ink-200 text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="px-6 py-20 border-t border-ink-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-6 p-6 border border-ink-800/50 bg-deep/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold">{edu.institution}</h3>
                <span className="px-3 py-1 rounded-full bg-deep border border-ink-800 text-ink-400 text-xs font-mono">
                  {edu.period}
                </span>
              </div>
              <p className="text-ink-400 text-sm mb-1">{edu.degree}</p>
              <p className="text-ink-500 text-sm">{edu.grade}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-20 border-t border-ink-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.04em] mb-8">
            LET'S BUILD SOMETHING
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${personalInfo.email}`}
              className="px-8 py-4 bg-electric text-void font-semibold text-sm"
            >
              Get in touch
            </a>
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-ink-700 text-ink-200 font-medium text-sm"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-ink-800/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-lg font-bold">{personalInfo.name}</p>
          <p className="text-meta">© 2026 — Nepal</p>
        </div>
      </footer>
    </div>
  );
}
