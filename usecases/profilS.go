package usecases

import "fus/repo"

type ProfileUseCase struct {
	repo *repo.Repo
}

func NewProUseCase(repo *repo.Repo) *ProfileUseCase {
	return &ProfileUseCase{repo: repo}
}

func (p *ProfileUseCase) SetProfileSettings(username, name, age, gender, zodiac, city, work, study, description, newFilename string, interests []string) error {
	err := p.repo.SetProfileSettings(username, name, age, gender, zodiac, city, work, study, description, newFilename, interests)
	if err != nil {
		return err
	}
	return nil
}
func (p *ProfileUseCase) GetProfileData(username string) (*repo.ProfileData, error) {
	data, err := p.repo.GetProfileData(username)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (p *ProfileUseCase) DeleteProfile(username string) error {
	return p.repo.DeleteUser(username)
}
