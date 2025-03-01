import { promises as fs } from "fs";
import type { Organization } from "./types";

// all path
const directoryPath = "/../organizations";

export const dataService = {
  getOrganizations: async () => {
    const files = await fs.readdir(process.cwd() + directoryPath);
    const organizations = await Promise.all(
      files.map(async (file) => {
        const organization = await fs.readFile(
          process.cwd() + directoryPath + "/" + file
        );
        return JSON.parse(organization.toString());
      })
    );
    // remove jina response
    organizations.forEach((org) => {
      delete org.jina_response;
      org.id = org.gsoc_url.split("/").pop() as string;
      // generate id for project
      org.projects.forEach((project) => {
        if (!project.project_name) {
          console.log(project);
          return;
        }

        project.id = project.project_name.split(" ").join("-").toLowerCase();
      });
      org.projects = org.projects.filter(
        (project, index, self) =>
          index === self.findIndex((p) => p.id === project.id)
      );
    });

    return organizations as Organization[];
  },

  getOrganizationById: async (id: string) => {
    const files = await fs.readdir(process.cwd() + directoryPath);
    const organizations = await Promise.all(
      files.map(async (file) => {
        const organization = await fs.readFile(
          process.cwd() + directoryPath + "/" + file
        );
        return JSON.parse(organization.toString());
      })
    );
    organizations.forEach((org) => {
      delete org.jina_response;
      org.id = org.gsoc_url.split("/").pop() as string;
      // generate id for project
      // console.log(org.projects);

      org.projects.forEach((project) => {
        if (!project.project_name) {
          console.log(project);
          return;
        }
        project.id = project.project_name.split(" ").join("-").toLowerCase();
      });

      org.projects = org.projects.filter(
        (project, index, self) =>
          index === self.findIndex((p) => p.id === project.id)
      );
    });
    return organizations.find((org) => org.id === id) as Organization;
  },
};
